import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBowlingBall, faTimes, faDesktop, faCloud, faCloudDownloadAlt, faCloudUploadAlt, faArrowRight,
  faQuestionCircle, faQuestion, faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';

library.add(faBowlingBall);
library.add(faTimes);
library.add(faDesktop);
library.add(faCloud);
library.add(faCloudDownloadAlt);
library.add(faCloudUploadAlt);
library.add(faArrowRight);
library.add(faQuestion);
library.add(faQuestionCircle);
library.add(faAngleDown);
library.add(faAngleUp);

export const FAIcon = (icon, size, props) => <FontAwesomeIcon icon={icon} size={size} {...props}/>;

export const IconBowlingBall = (size, props) => FAIcon('bowling-ball', size, props);
export const IconBowlingBallX = (size, props) => IconBowlingBall(`${size}x`, props);
export const IconBowlingBallLg = (props) => IconBowlingBall('lg', props);
export const IconBowlingBallSm = (props) => IconBowlingBall('sm', props);
export const IconBowlingBallXs = (props) => IconBowlingBall('xs', props);

export const IconTimes = (size, props) => FAIcon('times', size, props);
export const IconTimesX = (size, props) => IconTimes(`${size}x`, props);
export const IconTimesLg = (props) => IconTimes('lg', props);
export const IconTimesSm = (props) => IconTimes('sm', props);
export const IconTimesXs = (props) => IconTimes('xs', props);

export const IconDesktop = (size, props) => FAIcon('desktop', size, props);
export const IconDesktopX = (size, props) => IconDesktop(`${size}x`, props);
export const IconDesktopLg = (props) => IconDesktop('lg', props);
export const IconDesktopSm = (props) => IconDesktop('sm', props);
export const IconDesktopXs = (props) => IconDesktop('xs', props);

export const IconCloud = (size, props) => FAIcon('cloud', size, props);
export const IconCloudX = (size, props) => IconCloud(`${size}x`, props);
export const IconCloudLg = (props) => IconCloud('lg', props);
export const IconCloudSm = (props) => IconCloud('sm', props);
export const IconCloudXs = (props) => IconCloud('xs', props);

export const IconCloudDownload = (size, props) => FAIcon('cloud-download-alt', size, props);
export const IconCloudDownloadX = (size, props) => IconCloudDownload(`${size}x`, props);
export const IconCloudDownloadLg = (props) => IconCloudDownload('lg', props);
export const IconCloudDownloadSm = (props) => IconCloudDownload('sm', props);
export const IconCloudDownloadXs = (props) => IconCloudDownload('xs', props);

export const IconCloudUpload = (size, props) => FAIcon('cloud-upload-alt', size, props);
export const IconCloudUploadX = (size, props) => IconCloudUpload(`${size}x`, props);
export const IconCloudUploadLg = (props) => IconCloudUpload('lg', props);
export const IconCloudUploadSm = (props) => IconCloudUpload('sm', props);
export const IconCloudUploadXs = (props) => IconCloudUpload('xs', props);

export const IconArrowRight = (size, props) => FAIcon('arrow-right', size, props);
export const IconArrowRightX = (size, props) => IconArrowRight(`${size}x`, props);
export const IconArrowRightLg = (props) => IconArrowRight('lg', props);
export const IconArrowRightSm = (props) => IconArrowRight('sm', props);
export const IconArrowRightXs = (props) => IconArrowRight('xs', props);

export const IconQuestion = (size, props) => FAIcon('question', size, props);
export const IconQuestionX = (size, props) => IconQuestion(`${size}x`, props);
export const IconQuestionLg = (props) => IconQuestion('lg', props);
export const IconQuestionSm = (props) => IconQuestion('sm', props);
export const IconQuestionXs = (props) => IconQuestion('xs', props);

export const IconQuestionCircle = (size, props) => FAIcon('question-circle', size, props);
export const IconQuestionCircleX = (size, props) => IconQuestionCircle(`${size}x`, props);
export const IconQuestionCircleLg = (props) => IconQuestionCircle('lg', props);
export const IconQuestionCircleSm = (props) => IconQuestionCircle('sm', props);
export const IconQuestionCircleXs = (props) => IconQuestionCircle('xs', props);

export const IconAngleDown = (size, props) => FAIcon('angle-down', size, props);
export const IconAngleDownX = (size, props) => IconAngleDown(`${size}x`, props);
export const IconAngleDownLg = (props) => IconAngleDown('lg', props);
export const IconAngleDownSm = (props) => IconAngleDown('sm', props);
export const IconAngleDownXs = (props) => IconAngleDown('xs', props);

export const IconAngleUp = (size, props) => FAIcon('angle-up', size, props);
export const IconAngleUpX = (size, props) => IconAngleUp(`${size}x`, props);
export const IconAngleUpLg = (props) => IconAngleUp('lg', props);
export const IconAngleUpSm = (props) => IconAngleUp('sm', props);
export const IconAngleUpXs = (props) => IconAngleUp('xs', props);
