import React from 'react';
import ReactDom from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faCloud, faCloudDownloadAlt, faCloudUploadAlt, faArrowRight} from '@fortawesome/free-solid-svg-icons';

library.add(faDesktop);
library.add(faCloud);
library.add(faCloudDownloadAlt);
library.add(faCloudUploadAlt);
library.add(faArrowRight);

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
