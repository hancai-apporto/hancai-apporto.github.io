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

let h264DataList = null;
let h264draw = new H264Draw();
let h264Index = 0;

const infoMsgElement = document.querySelector('span#infoMsg');

const selectButton = document.querySelector('button#select');
const resetButton = document.querySelector('button#reset');
const playButton = document.querySelector('button#play');
const nextButton = document.querySelector('button#next');
const gotoButton = document.querySelector('button#goto');
const frameIdEdit = document.querySelector('input#frameId');

selectButton.addEventListener('click', () => {
    document.getElementById('fileInput').click();

    // infoMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
});

resetButton.addEventListener('click', () => {
    h264Index = 0;
    showLog();
});

playButton.addEventListener('click', async () => {
    if (playButton.textContent === 'Play') {
        playButton.textContent = 'Stop';
        updateElementsStatus(false);
        playButton.disabled = false;

        // Reset the current index
        h264Index = 0;

        // Display the h264 frames
        for (let i = 0; i < h264DataList.length; i++) {
            h264draw.draw_gfx(h264DataList[i]);
            await sleep(30);

            // Increase the current index
            h264Index++;

            showLog();
        }
    }
    else {
        playButton.textContent = 'Play';
        updateElementsStatus(true);
        playButton.disabled = false;
    }
});

nextButton.addEventListener('click', () => {
    // Check the current index
    if (h264Index >= h264DataList.length) {
        return;
    }

    // Draw the relevant h264 frame
    h264draw.draw_gfx(h264DataList[h264Index]);

    // Increase the index
    h264Index++;

    // Show log
    showLog();
});

gotoButton.addEventListener('click', async() => {
    // Check the frame id
    let frameId = parseInt(frameIdEdit.value, 10);
    if (frameId > h264DataList.length) {
        alert("The specified frame id overflows the number of H264 frames.");
        return;
    }

    // Disable all elements
    updateElementsStatus(false);

    // Reset the current index
    h264Index = 0;

    // Draw the h264 frames till the specified frame
    for (let i = 0; i < frameId; i++) {
        h264draw.draw_gfx(h264DataList[i]);
        await sleep(30);

        // Increase the current index
        h264Index++;

        showLog();
    }

    // Enable all elements
    updateElementsStatus(true);
});

// Handle multiple fileuploads
document.getElementById("fileInput").addEventListener("change", function(event){
    let files = event.currentTarget.files;
    let readers = [];

    // Abort if there were no files selected
    if (!files.length) return;

    // Enable the remaining buttons
    updateElementsStatus(true);

    // Store promises in array
    for (let i = 0; i < files.length;i++){
        // console.log("+++++ i=" + i + ", name=" + files[i].name);
        readers.push(readFileAsText(files[i]));
    }

    // Create a new list
    h264DataList = new Array(files.length);

    // Reset the index
    h264Index = 0;

    // Show log
    showLog();

    // Trigger Promises
    Promise.all(readers).then((values) => {
        // Values will be an array that contains an item
        // with the text of every selected file
        // ["File1 Content", "File2 Content" ... "FileN Content"]
        // console.log(values);
        for (let i = 0; i < files.length;i++){
            h264DataList[i] = new Uint8Array(values[i]);
        };
    });
}, false);

function readFileAsText(file){
    return new Promise(function(resolve,reject){
        let fr = new FileReader();

        fr.onload = function(){
            resolve(fr.result);
        };

        fr.onerror = function(){
            reject(fr);
        };

        fr.readAsArrayBuffer(file);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showLog() {
    infoMsgElement.innerHTML = `Total frames: ${h264DataList.length}, Current frame: ${h264Index}`;
}

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter, errMsg) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function(event) {
        textbox.addEventListener(event, function(e) {
            if (inputFilter(this.value)) {
                // Accepted value
                if (["keydown","mousedown","focusout"].indexOf(e.type) >= 0){
                this.classList.remove("input-error");
                this.setCustomValidity("");
                }
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                // Rejected value - restore the previous one
                this.classList.add("input-error");
                this.setCustomValidity(errMsg);
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                // Rejected value - nothing to restore
                this.value = "";
            }
        });
    });
}

// Install input filters.
setInputFilter(frameIdEdit,
    function(value) {return /^\d*$/.test(value); },
    "Must be an unsigned integer");

function updateElementsStatus(flag) {
    selectButton.disabled = !flag;
    playButton.disabled = !flag;
    resetButton.disabled = !flag;
    nextButton.disabled = !flag;
    gotoButton.disabled = !flag;
    frameIdEdit.disabled = !flag;
}
