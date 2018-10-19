import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDesktop, faCloud, faCloudDownloadAlt, faCloudUploadAlt, faArrowRight} from '@fortawesome/free-solid-svg-icons';

library.add(faTimes);
library.add(faDesktop);
library.add(faCloud);
library.add(faCloudDownloadAlt);
library.add(faCloudUploadAlt);
library.add(faArrowRight);

export const Times = (size) => <FontAwesomeIcon icon={'times'} size={size}/>;
export const TimesX = size => Times(`${size}x`);
export const TimesLg = () => Times('lg');
export const TimesSm = () => Times('sm');
export const TimesXs = () => Times('xs');

export const Desktop = (size) => <FontAwesomeIcon icon={'desktop'} size={size}/>;
export const DesktopX = size => Desktop(`${size}x`);
export const DesktopLg = () => Desktop('lg');
export const DesktopSm = () => Desktop('sm');
export const DesktopXs = () => Desktop('xs');

export const Cloud = (size) => <FontAwesomeIcon icon={'cloud'} size={size}/>;
export const CloudX = size => Cloud(`${size}x`);
export const CloudLg = () => Cloud('lg');
export const CloudSm = () => Cloud('sm');
export const CloudXs = () => Cloud('xs');

export const CloudDownload = (size) => <FontAwesomeIcon icon={'cloud-download-alt'} size={size}/>;
export const CloudDownloadX = size => CloudDownload(`${size}x`);
export const CloudDownloadLg = () => CloudDownload('lg');
export const CloudDownloadSm = () => CloudDownload('sm');
export const CloudDownloadXs = () => CloudDownload('xs');

export const CloudUpload = (size) => <FontAwesomeIcon icon={'cloud-upload-alt'} size={size}/>;
export const CloudUploadX = size => CloudUpload(`${size}x`);
export const CloudUploadLg = () => CloudUpload('lg');
export const CloudUploadSm = () => CloudUpload('sm');
export const CloudUploadXs = () => CloudUpload('xs');

export const ArrowRight = (size) => <FontAwesomeIcon icon={'arrow-right'} size={size}/>;
export const ArrowRightX = size => ArrowRight(`${size}x`);
export const ArrowRightLg = () => ArrowRight('lg');
export const ArrowRightSm = () => ArrowRight('sm');
export const ArrowRightXs = () => ArrowRight('xs');
