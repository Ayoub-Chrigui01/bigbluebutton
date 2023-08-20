import AbstractCollection from '/imports/ui/services/LocalCollectionSynchronizer/LocalCollectionSynchronizer';

// Collections
import Presentations from '/imports/api/presentations';
import PresentationPods from '/imports/api/presentation-pods';
import PresentationUploadToken from '/imports/api/presentation-upload-token';
import Screenshare from '/imports/api/screenshare';
import UserInfos from '/imports/api/users-infos';
import Polls, { CurrentPoll } from '/imports/api/polls';
import UsersPersistentData from '/imports/api/users-persistent-data';
import UserSettings from '/imports/api/users-settings';
import VideoStreams from '/imports/api/video-streams';
import VoiceUsers from '/imports/api/voice-users';
import WhiteboardMultiUser from '/imports/api/whiteboard-multi-user';
import GroupChat from '/imports/api/group-chat';
import ConnectionStatus from '/imports/api/connection-status';
import Captions from '/imports/api/captions';
import Pads, { PadsSessions, PadsUpdates } from '/imports/api/pads';
import AuthTokenValidation from '/imports/api/auth-token-validation';
import Annotations from '/imports/api/annotations';
import Breakouts from '/imports/api/breakouts';
import BreakoutsHistory from '/imports/api/breakouts-history';
import guestUsers from '/imports/api/guest-users';
import Meetings, { RecordMeetings, ExternalVideoMeetings, MeetingTimeRemaining, Notifications } from '/imports/api/meetings';
import { UsersTyping } from '/imports/api/group-chat-msg';
import Users, { CurrentUser } from '/imports/api/users';
import { Slides, SlidePositions } from '/imports/api/slides';

// Custom Publishers
export const localCollectionRegistry = {
  localCurrentPollSync: new AbstractCollection(CurrentPoll, CurrentPoll),
  localCurrentUserSync: new AbstractCollection(CurrentUser, CurrentUser),
  localSlidesSync: new AbstractCollection(Slides, Slides),
  localSlidePositionsSync: new AbstractCollection(SlidePositions, SlidePositions),
  localPollsSync: new AbstractCollection(Polls, Polls),
  localPresentationsSync: new AbstractCollection(Presentations, Presentations),
  localPresentationPodsSync: new AbstractCollection(PresentationPods, PresentationPods),
  localPresentationUploadTokenSync: new AbstractCollection(
    PresentationUploadToken,
    PresentationUploadToken,
  ),
  localScreenshareSync: new AbstractCollection(Screenshare, Screenshare),
  localUserInfosSync: new AbstractCollection(UserInfos, UserInfos),
  localUsersPersistentDataSync: new AbstractCollection(UsersPersistentData, UsersPersistentData),
  localUserSettingsSync: new AbstractCollection(UserSettings, UserSettings),
  localVideoStreamsSync: new AbstractCollection(VideoStreams, VideoStreams),
  localVoiceUsersSync: new AbstractCollection(VoiceUsers, VoiceUsers),
  localWhiteboardMultiUserSync: new AbstractCollection(WhiteboardMultiUser, WhiteboardMultiUser),
  localGroupChatSync: new AbstractCollection(GroupChat, GroupChat),
  localConnectionStatusSync: new AbstractCollection(ConnectionStatus, ConnectionStatus),
  localCaptionsSync: new AbstractCollection(Captions, Captions),
  localPadsSync: new AbstractCollection(Pads, Pads),
  localPadsSessionsSync: new AbstractCollection(PadsSessions, PadsSessions),
  localPadsUpdatesSync: new AbstractCollection(PadsUpdates, PadsUpdates),
  localAuthTokenValidationSync: new AbstractCollection(AuthTokenValidation, AuthTokenValidation),
  localAnnotationsSync: new AbstractCollection(Annotations, Annotations),
  localRecordMeetingsSync: new AbstractCollection(RecordMeetings, RecordMeetings),
  localExternalVideoMeetingsSync: new AbstractCollection(
    ExternalVideoMeetings,
    ExternalVideoMeetings,
  ),
  localMeetingTimeRemainingSync: new AbstractCollection(MeetingTimeRemaining, MeetingTimeRemaining),
  localUsersTypingSync: new AbstractCollection(UsersTyping, UsersTyping),
  localBreakoutsSync: new AbstractCollection(Breakouts, Breakouts),
  localBreakoutsHistorySync: new AbstractCollection(BreakoutsHistory, BreakoutsHistory),
  localGuestUsersSync: new AbstractCollection(guestUsers, guestUsers),
  localMeetingsSync: new AbstractCollection(Meetings, Meetings),
  localUsersSync: new AbstractCollection(Users, Users),
  localNotificationsSync: new AbstractCollection(Notifications, Notifications),
};

const collectionMirrorInitializer = () => {
  Object.values(localCollectionRegistry).forEach((localCollection) => {
    localCollection.setupListeners();
  });
};

export default collectionMirrorInitializer;
// const localUsersSync = new AbstractCollection(CurrentUser, CurrentUser);

// window.crop = {};
// console.log("CONNECTED!")


// const xEl = document.querySelector("#x")
// const yEl = document.querySelector("#y")
// const widthEl = document.querySelector("#width")
// const heigthEl = document.querySelector("#heigth")

// xEl.addEventListener("input",() => {
//     console.log("changed");
//     window.crop.x = xEl.value;
// })

// yEl.addEventListener("input",() => {
//     console.log("changed");
//     window.crop.y = yEl.value;
// })

// widthEl.addEventListener("input",() => {
//     console.log("changed");
//     window.crop.width = widthEl.value;
// })

// heigthEl.addEventListener("input",() => {
//     console.log("changed");
//     window.crop.heigth = heigthEl.value;
// })
window.onload = function() {
  initDragElement();
  initResizeElement();
};

function initDragElement() {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  var popups = document.getElementsByClassName("popup");
  var elmnt = null;
  var currentZIndex = 100; //TODO reset z index when a threshold is passed

  for (var i = 0; i < popups.length; i++) {
    var popup = popups[i];
    var header = getHeader(popup);

    popup.onmousedown = function() {
      this.style.zIndex = "" + ++currentZIndex;
    };

    if (header) {
      header.parentPopup = popup;
      header.onmousedown = dragMouseDown;
    }
  }

  function dragMouseDown(e) {
    elmnt = this.parentPopup;
    elmnt.style.zIndex = "" + ++currentZIndex;

    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    if (!elmnt) {
      return;
    }

    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function getHeader(element) {
    var headerItems = element.getElementsByClassName("popup-header");

    if (headerItems.length === 1) {
      return headerItems[0];
    }

    return null;
  }
}

let globalRatio = undefined;

function initResizeElement() {
  var popups = document.getElementsByClassName("popup");
  var element = null;
  var startX, startY, startWidth, startHeight;

  for (var i = 0; i < popups.length; i++) {
    var p = popups[i];

    var right = document.createElement("div");
    right.className = "resizer-right";
    p.appendChild(right);
    right.addEventListener("mousedown", initDrag, false);
    right.parentPopup = p;

    var bottom = document.createElement("div");
    bottom.className = "resizer-bottom";
    p.appendChild(bottom);
    bottom.addEventListener("mousedown", initDrag, false);
    bottom.parentPopup = p;

    var both = document.createElement("div");
    both.className = "resizer-both";
    p.appendChild(both);
    both.addEventListener("mousedown", initDrag, false);
    both.parentPopup = p;
  }

  function initDrag(e) {
    element = this.parentPopup;

    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(
      document.defaultView.getComputedStyle(element).width,
      10
    );
    startHeight = parseInt(
      document.defaultView.getComputedStyle(element).height,
      10
    );
    document.documentElement.addEventListener("mousemove", doDrag, false);
    document.documentElement.addEventListener("mouseup", stopDrag, false);
  }

  function doDrag(e) {
    if (!globalRatio) {
      element.style.width = startWidth + e.clientX - startX + "px";
      element.style.height = startHeight + e.clientY - startY + "px";
    }
    if(globalRatio === 1) {
      element.style.width = startWidth + e.clientX - startX + "px";
      element.style.height = (startWidth + e.clientX - startX)* 9 / 16 + "px";
    }
    if(globalRatio === 2) {
      element.style.width = startWidth + e.clientX - startX + "px";
      element.style.height = (startWidth + e.clientX - startX)* 3 / 4 + "px";
    }
  }

  function stopDrag() {
    document.documentElement.removeEventListener("mousemove", doDrag, false);
    document.documentElement.removeEventListener("mouseup", stopDrag, false);
  }
}

document.querySelector(".cancel-button").addEventListener('click' , () => {
  const videoContainer = document.querySelector('.ayoub');
  videoContainer.style.opacity = 0;
  videoContainer.style.zIndex = -1;
})

const ratio1 = document.querySelector('.ratio-1')
const ratio2 = document.querySelector('.ratio-2')

ratio1.addEventListener('click' , () => {
  ratio1.classList.toggle("active");
  if (globalRatio ===  1 ){
    globalRatio = undefined
  }
  else{
    globalRatio = 1;
  } 
})

ratio2.addEventListener('click' , () => {
  ratio2.classList.toggle("active");
  if (globalRatio ===  2 ) {
    globalRatio = undefined
  }
  else{
    globalRatio = 2;
  }
})