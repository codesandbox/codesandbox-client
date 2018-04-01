#!/bin/sh
# Creates ISO files for testing the ISOFS.
# Not auto-generated during the testing process to avoid a hard
# dependency on ISO-building tools.

# package.json is included in both so the proper directory structure
# is generated.

# NOTE: -graft-points doesn't work on newer versions of Mac OSX.
# So we have a gigantic exclusion list.

# Usage: make_iso flags filename
make_iso () {
  mkisofs $1 -o $2 -m 'node_modules' -m '.git' -m '.tscache' -m '.vscode' -m 'build' -m 'dist' -m 'scripts' -m 'src' -m 'tests' -m 'harness' -m '*.pem' -m '*.json' -m '*.zip' -m '*.iso' .
}

# -J: Joliet
# -D: Ignore 7 directory limit.
make_iso -JD test/fixtures/isofs/test_joliet.iso


# -hide-rr-moved:
# -R: Enable Rock Ridge
make_iso "-R -hide-rr-moved" test/fixtures/isofs/test_rock_ridge.iso
