import 'jsdom-global/register';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import StatsAnalyzer from '../../../../src/statsAnalyzer';
import NetworkQualityMonitor from '../../../../src/networkQualityMonitor';

const {assert} = chai;

chai.use(chaiAsPromised);
sinon.assert.expose(chai.assert, {prefix: ''});

describe('plugin-meetings', () => {
  describe('StatsAnalyzer', () => {
    describe('compareSentAndReceived()', () => {
      let statsAnalyzer;
      let sandBoxSpy;

      const initialConfig = {
        videoPacketLossRatioThreshold: 9
      };

      const defaultStats = {
        internal: {
          video: {
            send: {
              totalPacketsLostOnReceiver: 10
            }
          }
        },
        video: {
          send: {
            packetsSent: 2,
            meanRemoteJitter: [],
            meanRoundTripTime: []
          }
        }
      };

      const statusResult = {
        type: 'remote-inbound-rtp',
        packetsLost: 11,
        rttThreshold: 501,
        jitterThreshold: 501
      };

      const sandbox = sinon.createSandbox();

      beforeEach(() => {
        const networkQualityMonitor = new NetworkQualityMonitor(initialConfig);

        statsAnalyzer = new StatsAnalyzer(initialConfig, networkQualityMonitor, defaultStats);

        sandBoxSpy = sandbox.spy(statsAnalyzer.networkQualityMonitor, 'determineUplinkNetworkQuality');
      });

      afterEach(() => {
        sandbox.restore();
      });

      it('should trigger determineUplinkNetworkQuality with specific arguments', async () => {
        await statsAnalyzer.parseGetStatsResult(statusResult, 'video');

        assert.calledOnce(statsAnalyzer.networkQualityMonitor.determineUplinkNetworkQuality);
        assert(sandBoxSpy.calledWith({
          mediaType: 'video',
          remoteRtpResults: statusResult,
          statsAnalyzerCurrentStats: statsAnalyzer.statsResults
        }));
      });
    });
  });
});
