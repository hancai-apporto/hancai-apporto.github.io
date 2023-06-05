# h264viewer
This project renders the H264 frames on canvas.

## Goals

The main design goal is to provide a complete, fully standards-compliant web application for rendering the H264 frames.

When capturing the H264 frames from the RDS (remote desktop server), we need to render those H264 frames one by one for analyzing them.

## Notes

This project uses [Broadway](https://github.com/mbebenita/Broadway) library for rendering the H264 frames.

## Run

In order to run this project, we need Apache 2.

We copy this project to the default root folder (`/var/www/html/`) of the web server **Apache 2**.

## Limitations

* This project can only work with **H264 baseline profile** due to the limitations of [Broadway](https://github.com/mbebenita/Broadway) library.

This project is distributed under the GNU Lesser General Public License.

Please see the file LICENSE for more details.
