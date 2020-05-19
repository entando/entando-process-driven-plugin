#!/bin/bash
set -e

function injectResource() {
    local resource="$1"
    local destFile="$2"
    local injectionPoint="$3"

    sed -i 's|'"$injectionPoint"'|'"$resource$injectionPoint"'|g' "$destFile"
}

export -f injectResource
export INJECTION_POINT="<#-- entando_resource_injection_point -->"
export INJECTION_POINT_CONFIG="# entando_resource_injection_point"
BUNDLE_NAME=$(awk -F':' 'NR==1 {gsub(/ /, "", $2); print $2}' ./bundle/descriptor.yaml)
output_dir=bundle_out

echo "Generation of the $BUNDLE_NAME bundle"
echo "====================================="
echo ""

## Build widgets
echo "- Building widgets"
cd widgets
npm install
npm run build
cd ../

# Clean previous build
rm -rf ${output_dir}

# Copy files to output directory
echo "- Copying resources to ${output_dir}"
mkdir -p ${output_dir}/resources/static/{js,css}
cp -r bundle/* ${output_dir}/
cp -r widgets/build/static/js/*.js ${output_dir}/resources/static/js
cp -r widgets/build/static/css/*.css ${output_dir}/resources/static/css
mkdir -p ${output_dir}/widgets
cp -r widgets/templates/* ${output_dir}/widgets

# JS resources
for jspath in ${output_dir}/resources/static/js/*;
do
    # This moves the referenced file to the top level ${output_dir}/resources/static dir for correct processing when loaded
    jsfile=$(basename "$jspath")
    config_ui_resources=${config_ui_resources}"    - ${BUNDLE_NAME}/static/js/${jsfile}\n"
    js_resources=${js_resources}"<script src=\"<@wp.resourceURL />${BUNDLE_NAME}/static/js/${jsfile}\"></script>\n"
done

# CSS resources
for csspath in ${output_dir}/resources/static/css/*;
do
    # This moves the referenced file to the top level ${output_dir}/resources/static dir for correct processing when loaded
    cssfile=$(basename "$csspath")
    config_ui_resources=${config_ui_resources}"    - ${BUNDLE_NAME}/static/css/${cssfile}\n"
    css_resources=${css_resources}"<link href=\"<@wp.resourceURL />${BUNDLE_NAME}/static/css/${cssfile}\" rel=\"stylesheet\">\n"
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