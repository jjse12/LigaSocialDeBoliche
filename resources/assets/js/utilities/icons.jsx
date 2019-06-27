import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBowlingBall, faCheck, faTimes, faDesktop, faCloud, faCloudDownloadAlt, faCloudUploadAlt, faArrowRight,
  faQuestionCircle, faQuestion, faAngleDown, faAngleUp, faEllipsisV} from '@fortawesome/free-solid-svg-icons';

library.add(faBowlingBall);
library.add(faCheck);
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
library.add(faEllipsisV);

export const FASizeXs = 'xs';
export const FASizeSm = 'sm';
export const FASizeLg = 'lg';

export const FAIcon = (icon, size, props) => <FontAwesomeIcon icon={icon} size={size} {...props}/>;

export const IconBowlingBall = (size, props) => FAIcon('bowling-ball', size, props);
export const IconBowlingBallX = (size, props) => IconBowlingBall(`${size}x`, props);
export const IconBowlingBallLg = (props) => IconBowlingBall(FASizeLg, props);
export const IconBowlingBallSm = (props) => IconBowlingBall(FASizeSm, props);
export const IconBowlingBallXs = (props) => IconBowlingBall(FASizeXs, props);

export const IconCheck = (size, props) => FAIcon('check', size, props);
export const IconCheckX = (size, props) => IconCheck(`${size}x`, props);
export const IconCheckLg = (props) => IconCheck(FASizeLg, props);
export const IconCheckSm = (props) => IconCheck(FASizeSm, props);
export const IconCheckXs = (props) => IconCheck(FASizeXs, props);


export const IconTimes = (size, props) => FAIcon('times', size, props);
export const IconTimesX = (size, props) => IconTimes(`${size}x`, props);
export const IconTimesLg = (props) => IconTimes(FASizeLg, props);
export const IconTimesSm = (props) => IconTimes(FASizeSm, props);
export const IconTimesXs = (props) => IconTimes(FASizeXs, props);

export const IconDesktop = (size, props) => FAIcon('desktop', size, props);
export const IconDesktopX = (size, props) => IconDesktop(`${size}x`, props);
export const IconDesktopLg = (props) => IconDesktop(FASizeLg, props);
export const IconDesktopSm = (props) => IconDesktop(FASizeSm, props);
export const IconDesktopXs = (props) => IconDesktop(FASizeXs, props);

export const IconCloud = (size, props) => FAIcon('cloud', size, props);
export const IconCloudX = (size, props) => IconCloud(`${size}x`, props);
export const IconCloudLg = (props) => IconCloud(FASizeLg, props);
export const IconCloudSm = (props) => IconCloud(FASizeSm, props);
export const IconCloudXs = (props) => IconCloud(FASizeXs, props);

export const IconCloudDownload = (size, props) => FAIcon('cloud-download-alt', size, props);
export const IconCloudDownloadX = (size, props) => IconCloudDownload(`${size}x`, props);
export const IconCloudDownloadLg = (props) => IconCloudDownload(FASizeLg, props);
export const IconCloudDownloadSm = (props) => IconCloudDownload(FASizeSm, props);
export const IconCloudDownloadXs = (props) => IconCloudDownload(FASizeXs, props);

export const IconCloudUpload = (size, props) => FAIcon('cloud-upload-alt', size, props);
export const IconCloudUploadX = (size, props) => IconCloudUpload(`${size}x`, props);
export const IconCloudUploadLg = (props) => IconCloudUpload(FASizeLg, props);
export const IconCloudUploadSm = (props) => IconCloudUpload(FASizeSm, props);
export const IconCloudUploadXs = (props) => IconCloudUpload(FASizeXs, props);

export const IconArrowRight = (size, props) => FAIcon('arrow-right', size, props);
export const IconArrowRightX = (size, props) => IconArrowRight(`${size}x`, props);
export const IconArrowRightLg = (props) => IconArrowRight(FASizeLg, props);
export const IconArrowRightSm = (props) => IconArrowRight(FASizeSm, props);
export const IconArrowRightXs = (props) => IconArrowRight(FASizeXs, props);

export const IconQuestion = (size, props) => FAIcon('question', size, props);
export const IconQuestionX = (size, props) => IconQuestion(`${size}x`, props);
export const IconQuestionLg = (props) => IconQuestion(FASizeLg, props);
export const IconQuestionSm = (props) => IconQuestion(FASizeSm, props);
export const IconQuestionXs = (props) => IconQuestion(FASizeXs, props);

export const IconQuestionCircle = (size, props) => FAIcon('question-circle', size, props);
export const IconQuestionCircleX = (size, props) => IconQuestionCircle(`${size}x`, props);
export const IconQuestionCircleLg = (props) => IconQuestionCircle(FASizeLg, props);
export const IconQuestionCircleSm = (props) => IconQuestionCircle(FASizeSm, props);
export const IconQuestionCircleXs = (props) => IconQuestionCircle(FASizeXs, props);

export const IconAngleDown = (size, props) => FAIcon('angle-down', size, props);
export const IconAngleDownX = (size, props) => IconAngleDown(`${size}x`, props);
export const IconAngleDownLg = (props) => IconAngleDown(FASizeLg, props);
export const IconAngleDownSm = (props) => IconAngleDown(FASizeSm, props);
export const IconAngleDownXs = (props) => IconAngleDown(FASizeXs, props);

export const IconAngleUp = (size, props) => FAIcon('angle-up', size, props);
export const IconAngleUpX = (size, props) => IconAngleUp(`${size}x`, props);
export const IconAngleUpLg = (props) => IconAngleUp(FASizeLg, props);
export const IconAngleUpSm = (props) => IconAngleUp(FASizeSm, props);
export const IconAngleUpXs = (props) => IconAngleUp(FASizeXs, props);

export const IconEllipsisV = (size, props) => FAIcon('ellipsis-v', size, props);
export const IconEllipsisVX = (size, props) => IconEllipsisV(`${size}x`, props);
export const IconEllipsisVLg = (props) => IconEllipsisV(FASizeLg, props);
export const IconEllipsisVSm = (props) => IconEllipsisV(FASizeSm, props);
export const IconEllipsisVXs = (props) => IconEllipsisV(FASizeXs, props);
