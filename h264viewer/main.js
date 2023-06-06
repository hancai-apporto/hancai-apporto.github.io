/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';

/* globals MediaRecorder */

let h264DataList     = [];
let h264draw         = new H264Draw();
var i                = 1;

const FRAME_COUNT    = 367;
const HTTP_OK        = 200;
const infoMsgElement = document.querySelector('span#infoMsg');
const playButton     = document.querySelector('button#play');

$(function() {

    readFiles(i);

});

function readFiles(i) {

    if (i > FRAME_COUNT)
        return;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', window.origin + '/h264viewer/resources/' + i.toString().padStart(4, '0') + '.h264', true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = async function() {

        if (this.status === HTTP_OK) {
            var binaryData = this.response;
            console.log('File Number:', i.toString().padStart(4, '0'), 'File loaded:', binaryData);

            // Display the h264 frames
            h264draw.draw_gfx(new Uint8Array(binaryData));
            await sleep(30);

            readFiles(i + 1);
        }
        else {
            console.log('Error: ' + xhr.statusText);
        }

    };

    xhr.onerror = function() {
        console.log('Error: ' + xhr.statusText);
    };

    xhr.send();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
