#!/bin/bash
set -e

function injectResource() {
    local resource="$1"
    local destFile="$2"

    local _NL=$'\\\n'

    sed -i 's|'"$INJECTION_POINT"'|'"$resource$_NL$INJECTION_POINT"'|g' "$destFile"
}

export -f injectResource
export INJECTION_POINT="<#-- entando_resource_injection_point -->"
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
    js_resources=${js_resources}"\n<script src=\"<@wp.resourceURL />${BUNDLE_NAME}/static/js/${jsfile}\"></script>"
done

# CSS resources
for csspath in ${output_dir}/resources/static/css/*;
do
    # This moves the referenced file to the top level ${output_dir}/resources/static dir for correct processing when loaded
    cssfile=$(basename "$csspath")

    css_resources=${css_resources}"\n<link href=\"<@wp.resourceURL />${BUNDLE_NAME}/static/css/${cssfile}\" rel=\"stylesheet\">"
done

# Inject resources
echo "- Injecting resources"
for ftlName in ${output_dir}/widgets/*.ftl;
do
    injectResource "$js_resources" "$ftlName"
    injectResource "$css_resources" "$ftlName"
done
