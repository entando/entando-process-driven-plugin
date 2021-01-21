#!/bin/bash
set -e

function injectResource() {
    local resource="$1"
    local destFile="$2"
    local injectionPoint="$3"

    sed -i'.bak' 's|'"$injectionPoint"'|'"$resource$injectionPoint"'|g' "$destFile"
}

export -f injectResource
export INJECTION_POINT="<#-- entando_resource_injection_point -->"
export INJECTION_POINT_CONFIG="# entando_resource_injection_point"

export _NL=$'\\\n'

input_dir=bundle_src
output_dir=bundle

BUNDLE_NAME=$(awk -F':' 'NR==1 {gsub(/ /, "", $2); print $2}' ./${input_dir}/descriptor.yaml)

echo "Generation of the $BUNDLE_NAME bundle"
echo "====================================="
echo ""

## Build widgets
echo "- Building widgets"
cd widgets
npm install
npm run build
cd ../

# Clean previous build but retain .git so ent CLI retains its context for publishing the bundle
find ${output_dir} -type f -not -path "${output_dir}/.git*" -exec rm {} \;

# Copy files to output directory
echo "- Copying resources to ${output_dir}"
mkdir -p ${output_dir}/resources/static/{js,css}
cp -r widgets/build/static/js/*.js ${output_dir}/resources/static/js
cp -r widgets/build/static/css/*.css ${output_dir}/resources/static/css
rm -f ${output_dir}/resources/static/css/main.*.chunk.css
cp -r ${input_dir}/* ${output_dir}/

# JS resources
for jspath in ${output_dir}/resources/static/js/*;
do
    # This moves the referenced file to the top level ${output_dir}/resources/static dir for correct processing when loaded
    jsfile=$(basename "$jspath")
    config_ui_resources=${config_ui_resources}"    - ${BUNDLE_NAME}/static/js/${jsfile}$_NL"
    js_resources=${js_resources}"<script src=\"<@wp.resourceURL />${BUNDLE_NAME}/static/js/${jsfile}\"></script>$_NL"
done

# CSS resources
for csspath in ${output_dir}/resources/static/css/*;
do
    # This moves the referenced file to the top level ${output_dir}/resources/static dir for correct processing when loaded
    cssfile=$(basename "$csspath")
    config_ui_resources=${config_ui_resources}"    - ${BUNDLE_NAME}/static/css/${cssfile}$_NL"
    css_resources=${css_resources}"<link href=\"<@wp.resourceURL />${BUNDLE_NAME}/static/css/${cssfile}\" rel=\"stylesheet\">$_NL"
done

# Inject resources on ftl files
echo "- Injecting resources for FTL files"
for ftlName in ${output_dir}/widgets/*.ftl;
do
    injectResource "$js_resources" "$ftlName" "$INJECTION_POINT"
    injectResource "$css_resources" "$ftlName" "$INJECTION_POINT"
done

# Inject resources on descriptor files
echo "- Injecting resources for config UI"
for descriptorName in ${output_dir}/widgets/*.yaml;
do
    injectResource "$config_ui_resources" "$descriptorName" "$INJECTION_POINT_CONFIG"
done

# Remove backup files
echo "- Remove backup files"
rm ${output_dir}/widgets/*.bak;

