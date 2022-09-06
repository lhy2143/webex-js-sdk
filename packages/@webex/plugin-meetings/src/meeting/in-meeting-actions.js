/*!
 * Copyright (c) 2015-2020 Cisco Systems, Inc. See LICENSE file.
 */

import {
  MEETINGS
} from '../constants';

/**
 * @class InMeetingActions
 */
export default class InMeetingActions {
  namespace = MEETINGS;

  constructor() {
    this.canLock = null;
    this.canUnlock = null;
    this.canAssignHost = null;
    this.canStartRecording = null;
    this.canPauseRecording = null;
    this.canResumeRecording = null;
    this.canStopRecording = null;
    this.canRaiseHand = null;
    this.canLowerAllHands = null;
    this.canLowerSomeoneElsesHand = null;
  }

  get() {
    return {
      canLock: this.canLock,
      canUnlock: this.canUnlock,
      canAssignHost: this.canAssignHost,
      canStartRecording: this.canStartRecording,
      canPauseRecording: this.canPauseRecording,
      canResumeRecording: this.canResumeRecording,
      canStopRecording: this.canStopRecording,
      canRaiseHand: this.canRaiseHand,
      canLowerAllHands: this.canLowerAllHands,
      canLowerSomeoneElsesHand: this.canLowerSomeoneElsesHand,
    };
  }

  set(actions) {
    const old = this.get();

    let changed = false;

    Object.keys(old).forEach((actionKey) => {
      const actionValue = actions[actionKey];

      if (actionValue !== undefined && actionValue !== old[actionKey]) {
        changed = true;
        this[actionKey] = actionValue;
      }
    });

    return changed;
  }
}
