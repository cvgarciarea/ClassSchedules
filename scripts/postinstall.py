#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os


def remove_cycles_warnings():
    files = [
        './node_modules/metro/src/lib/polyfills/require.js',
        './node_modules/react-native/node_modules/@react-native-community/cli/node_modules/metro/src/lib/polyfills/require.js',
    ]

    contentToReplace = '''console.warn(
        `Require cycle: '''

    newContent = 'const noConsoleWarn = (`'

    for _file in files:
        if os.path.exists(_file):
            print('Removing "Require cycle" warning from:', _file)

            with open(_file) as pfile:
                content = pfile.read()

            with open(_file, 'w') as pfile:
                pfile.write(content.replace(contentToReplace, newContent))


if __name__ == '__main__':
    remove_cycles_warnings()
