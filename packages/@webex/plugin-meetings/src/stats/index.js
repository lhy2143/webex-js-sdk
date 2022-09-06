import {forEach} from 'lodash';
import {StatelessWebexPlugin} from '@webex/webex-core';

import {
  MEETINGS,
  STATS
} from '../constants';
import MeetingStats from '../stats/stats';
import StatsUtil from '../stats/util';

/**
 * @class WebRTCStats
 */
export default class WebRTCStats extends StatelessWebexPlugin {
  namespace = MEETINGS;

  /**
    *
    * @param {Object} attrs
    * @param {Object} options
    * @param {Object} [optionalCreateOptions]
   */
  constructor(attrs, options, optionalCreateOptions) {
    super({}, options);
    /**
     * @instance
     * @type {Object}
     * @private
     * @memberof WebRTCStats
     */
    this.attrs = attrs;
    /**
     * @instance
     * @type {Object}
     * @private
     * @memberof WebRTCStats
     */
    this.options = options;
    /**
     * @instance
     * @type {Object}
     * @public
     * @memberof WebRTCStats
     */
    this.senders = {};
    /**
     * @instance
     * @type {Object}
     * @public
     * @memberof WebRTCStats
     */
    this.receivers = {};
    /**
     * @instance
     * @type {Meeting}
     * @private
     * @memberof WebRTCStats
     */
    this.meetingRef = null;
    /**
     * @instance
     * @type {Object}
     * @public
     * @memberof WebRTCStats
     */
    this.statsConfig = null;
    this.populate(optionalCreateOptions);
  }

  /**
     * @param {Object} [optionalCreateOptions]
     * @param {Object} optionalCreateOptions.config
     * @param {Meeting} optionalCreateOptions.meeting
     * @param {Object} optionalCreateOptions.senders
     * @param {Object} optionalCreateOptions.receivers
     * @returns {WebRTCStats}
     * @private
     * @memberof WebRTCStats
     */
  populate(optionalCreateOptions) {
    if (optionalCreateOptions) {
      if (optionalCreateOptions.config) {
        this.setConfig(optionalCreateOptions.config);
      }
      if (optionalCreateOptions.meeting) {
        this.associateMeeting(optionalCreateOptions.meeting);
      }
      if (optionalCreateOptions.senders) {
        this.addSenders(optionalCreateOptions.senders);
      }
      if (optionalCreateOptions.receivers) {
        this.addReceivers(optionalCreateOptions.receivers);
      }
    }

    return this;
  }

  /**
     * @param {Object} config
     * @returns {WebRTCStats}
     * @public
     * @memberof WebRTCStats
     */
  setConfig(config) {
    this.statsConfig = config;
  }

  /**
     * @param {Meeting} meeting
     * @returns {WebRTCStats}
     * @public
     * @memberof WebRTCStats
     */
  associateMeeting(meeting) {
    this.meetingRef = meeting;

    return this;
  }

  /**
     * @param {Object} senders
     * @param {Boolean} useConfig
     * @returns {WebRTCStats}
     * @public
     * @memberof WebRTCStats
     */
  addSenders(senders, useConfig = false) {
    if (!senders.forEach) {
      throw new TypeError('Stats senders must be created with an iterable array of senders to act on.');
    }
    senders.forEach((sender) => {
      this.addSender(sender, useConfig);
    });

    return this;
  }

  /**
     * @param {Object} sender
     * @param {Boolean} useConfig
     * @returns {WebRTCStats}
     * @public
     * @memberof WebRTCStats
     */
  addSender(sender, useConfig = false) {
    if (sender) {
      if (useConfig) {
        StatsUtil.generateSingularOptions(sender, this.statsConfig, this.meetingRef, STATS.SENDERS);
      }
      sender.type = STATS.SENDER;
      this.senders[sender.id] = new MeetingStats(this.attrs, this.options, sender);
    }

    return this;
  }

  /**
     *
     * @param {String} id
     * @returns {WebRTCStats}
     * @public
     * @memberof WebRTCStats
     */
  addSenderStats(id) {
    const newSender = new MeetingStats(this.attrs, this.options);

    this.senders[id] = newSender;

    return newSender;
  }

  /**
     *
     * @param {String} id
     * @returns {WebRTCStats}
     * @public
     * @memberof WebRTCStats
     */
  addReceiverStats(id) {
    const newReceiver = new MeetingStats(this.attrs, this.options);

    this.receivers[id] = newReceiver;

    return newReceiver;
  }

  /**
     * @param {Object} receivers
     * @param {boolean} useConfig
     * @returns {WebRTCStats}
     * @public
     * @memberof WebRTCStats
     */
  addReceivers(receivers, useConfig = false) {
    if (!receivers.forEach) {
      throw new TypeError('Stats receivers must be created with an iterable array of receivers to act on.');
    }
    receivers.forEach((receiver) => {
      this.addReceiver(receiver, useConfig);
    });

    return this;
  }

  /**
     * @param {Object} receiver
     * @param {boolean} useConfig
     * @returns {WebRTCStats}
     * @public
     * @memberof WebRTCStats
     */
  addReceiver(receiver, useConfig = false) {
    if (receiver) {
      if (useConfig) {
        StatsUtil.generateSingularOptions(receiver, this.statsConfig, this.meetingRef, STATS.RECEIVERS);
      }
      receiver.type = STATS.RECEIVER;
      this.receivers[receiver.id] = new MeetingStats(this.attrs, this.options, receiver);
    }

    return this;
  }

  /**
     * @returns {Object}
     * @public
     * @memberof WebRTCStats
     */
  getReceivers() {
    return this.receivers;
  }

  /**
     * @returns {Object}
     * @public
     * @memberof WebRTCStats
     */
  getSenders() {
    return this.senders;
  }

  /**
     * @param {String} id
     * @returns {Object}
     * @public
     * @memberof WebRTCStats
     */
  getSender(id) {
    return this.senders[id];
  }

  /**
     * @param {String} id
     * @returns {Object}
     * @public
     * @memberof WebRTCStats
     */
  getReceiver(id) {
    return this.receivers[id];
  }

  /**
     * @returns {Object}
     * @public
     * @memberof WebRTCStats
     */
  destroySenders() {
    forEach(this.senders, (v, k) => {
      this.destroySender(k);
    });
  }

  /**
     * @returns {undefined}
     * @public
     * @memberof WebRTCStats
     */
  destroyReceivers() {
    forEach(this.receivers, (v, k) => {
      this.destroyReceiver(k);
    });
  }

  /**
     * @param {String} id
     * @returns {undefined}
     * @public
     * @memberof WebRTCStats
     */
  destroySender(id) {
    let sender = this.getSender(id);

    if (sender) {
      if (sender.stream) {
        sender.stream.destroy();
      }
    }
    sender = null;
    delete this.receivers[id];
  }

  /**
     * @param {String} id
     * @returns {undefined}
     * @public
     * @memberof WebRTCStats
     */
  destroyReceiver(id) {
    let receiver = this.getReceiver(id);

    if (receiver) {
      if (receiver.stream) {
        receiver.stream.destroy();
      }
    }
    receiver = null;
    delete this.receivers[id];
  }
}
