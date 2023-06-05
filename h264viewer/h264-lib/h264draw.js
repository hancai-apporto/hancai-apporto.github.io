/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

H264Draw = function() {

    var m_display = this;

    var yuvCanvas = null;
    var canvas = document.querySelector('canvas#h264image');

    canvas.style.width = '640px';
    canvas.style.height = '480px';

    this.drawImageGfx = function(buffer, width, height) {
        var ylen = width * height;
        var uvlen = (width / 2) * (height / 2);
        if (yuvCanvas === null) {
            yuvCanvas = new YUVCanvas({
                canvas: canvas,
                width: width ,
                height: height ,
            });
        }

        if (yuvCanvas.width != width || yuvCanvas.height != height) {
            yuvCanvas = new YUVCanvas({
                canvas: canvas,
                width: width,
                height: height,
            });
        }

        yuvCanvas.drawNextOutputPicture({
            yData: buffer.subarray(0, ylen),
            uData: buffer.subarray(ylen, ylen + uvlen),
            vData: buffer.subarray(ylen + uvlen, ylen + uvlen * 2)
        });
    };

    this.pDecoder = new Player({
        webgl:       true,
        useWorker:   false,
        render:      true,
        reuseMemory: true,
    });

    this.pDecoder.onPictureDecoded =  function(buffer, width, height, infos){
        m_display.drawImageGfx(buffer, width, height);
    };

    this.draw_gfx = function(buffer) {
        m_display.pDecoder.decode(buffer);
    };

};
