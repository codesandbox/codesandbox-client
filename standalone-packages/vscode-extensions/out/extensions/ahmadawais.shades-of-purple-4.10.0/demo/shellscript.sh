# Demo Shell Script file.

####.#### —————————————————— ALIASES —————————————————— ####.####

# Easier directory navigation.
alias ~="cd ~"
alias .="cd .."
alias ..="cd ../.."
alias ...="cd ../../.."
alias ....="cd ../../../.."
alias cd..="cd .." # Typo addressed.

# Recursively delete all `.DS_Store` files in the pwd.
alias rmds="find . -type f -name '*.DS_Store' -ls -delete"

# Get week number of the year.
alias week='date +%V'

####.#### —————————————————— FUNCTIONS —————————————————— ####.####

# Command line magic.
function rainbow() {
	yes "$(seq 231 -1 16)" | while read i; do printf "\x1b[48;5;${i}m\n"; sleep .02; done
}

# Show macOS Battery Percentage.
function battery() {
	pmset -g batt | egrep "([0-9]+\%).*" -o --colour=auto | cut -f1 -d';'
}

# Show Wi-Fi Network Password.
# Exchange SSID with the SSID of the access point you wish to query the password from.
# Usage: wifiPass NAME_OF_THE_WIFI
function wifiPass() {
	security find-generic-password -D "AirPort network password" -a "$@" -gw
}
