#!/bin/sh

if [ -f "$WERCKER_CACHE_DIR/flow/flow" ];
then
    debug "flow found in cache"f
else
    debug "flow not found in cache, will download"
    curl -o "$WERCKER_CACHE_DIR/flow.zip" "http://flowtype.org/downloads/flow-linux64-latest.zip"
    unzip "$WERCKER_CACHE_DIR/flow.zip" -d $WERCKER_CACHE_DIR
    rm -rf "$WERCKER_CACHE_DIR/flow/examples"
fi
