import {assert} from '@webex/test-helper-chai';

import InMeetingActions from '@webex/plugin-meetings/src/meeting/in-meeting-actions';


describe('plugin-meetings', () => {
  describe('in-meeting-actions', () => {
    const checkValues = (actions, expected) => {
      const expectedValues = {
        canLock: null,
        canUnlock: null,
        canAssignHost: null,
        canStartRecording: null,
        canPauseRecording: null,
        canResumeRecording: null,
        canStopRecording: null,
        canRaiseHand: null,
        canLowerAllHands: null,
        canLowerSomeoneElsesHand: null,
        ...expected
      };

      // Check get retuns all the correct values at once
      assert.deepEqual(actions.get(), expectedValues);

      // Check each value individually
      Object.keys(expectedValues).forEach((key) => {
        assert.deepEqual(actions[key], expectedValues[key]);
      });
    };

    [
      'canLock',
      'canUnlock',
      'canAssignHost',
      'canStartRecording',
      'canPauseRecording',
      'canResumeRecording',
      'canStopRecording',
      'canRaiseHand',
      'canLowerAllHands',
      'canLowerSomeoneElsesHand',
    ].forEach((key) => {
      it(`get and set for ${key} work as expected`, () => {
        const inMeetingActions = new InMeetingActions();

        checkValues(inMeetingActions);

        let changed = inMeetingActions.set({[key]: true});

        assert.isTrue(changed);

        checkValues(inMeetingActions, {[key]: true});

        changed = inMeetingActions.set({[key]: true});

        assert.isFalse(changed);
      });
    });
  });
});
