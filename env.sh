#!/bin/bash

# Recreate config file
envConfigFilePath=./packages/app/static/js/env-config.js

rm -rf $envConfigFilePath
touch $envConfigFilePath

# Add assignment 
echo "window._env_ = {" >> $envConfigFilePath

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}
  
  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >> $envConfigFilePath
done < ".env.$NODE_ENV"

echo "}" >> $envConfigFilePath