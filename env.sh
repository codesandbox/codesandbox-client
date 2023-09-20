#!/bin/sh

# Recreate config file
envConfigFilePath=$1

rm -rf $envConfigFilePath
touch $envConfigFilePath

# Add assignment 
echo "window._env_ = {" >> $envConfigFilePath


while IFS='=' read -r varname varvalue || [ -n "$varname" ]; do
  value=""
  if [ -n "$varname" ]; then
    eval "value=\"\${$varname}\""
  fi

  # Otherwise use value from .env file
  if [ -z "$value" ]; then
    value="$varvalue"
  fi
  
  echo "  $varname: \"$value\"," >> "$envConfigFilePath"
done < ".env"

echo "}" >> "$envConfigFilePath"
