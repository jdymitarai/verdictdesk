/**
 * VerdictDesk - Tri-Agent Dialectic Market & Legal Forensics Engine
 * Implements BullAgent, BearAgent, and ChiefJusticeAgent with strict mathematical bounds.
 */

const { MerkleTree } = require('./merkle.js');

class BullAgent {
  constructor(name = 'Bull-Alpha') {
    this.name = name;
    this.role = 'MOMENTUM_AND_INFLOW_FORENSICS';
  }

  evaluate(evidence) {
    const netInflow = evidence.onchainMetrics.largeTransferInflowUSD - evidence.onchainMetrics.largeTransferOutflowUSD;
    const whaleAccumulation = evidence.onchainMetrics.whaleWalletCountChange24h;
    const sentimentScore = evidence.socialSentiment.positiveScore;

    let conviction = 0.5;
    let argument = '';

    if (netInflow > 10_000_000 && whaleAccumulation > 0) {
      conviction = Math.min(0.95, 0.65 + (netInflow / 100_000_000) * 0.2 + sentimentScore * 0.1);
      argument = `Strong institutional accumulation confirmed: Net 24h onchain inflow is +$${(netInflow / 1e6).toFixed(2)}M with ${whaleAccumulation} new tier-1 whale wallets. Liquidity depth supports upward momentum. Recommended entry: Breakout accumulation.`;
    } else {
      conviction = 0.40;
      argument = `Moderate spot absorption observed, but net large transfers remain muted (+$${(netInflow / 1e6).toFixed(2)}M). Recommend cautious scaling.`;
    }

    return {
      agent: this.name,
      stance: 'BULLISH',
      conviction: parseFloat(conviction.toFixed(4)),
      thesis: argument,
      metricSnapshot: { netInflowUSD: netInflow, sentimentScore }
    };
  }
}

class BearAgent {
  constructor(name = 'Bear-Omicron') {
    this.name = name;
    this.role = 'REGULATORY_AND_LIQUIDITY_RISK';
  }

  evaluate(evidence) {
    const regulatoryRisks = evidence.legalCompliance.flaggedJurisdictions;
    const sanctionsRisk = evidence.legalCompliance.sanctionedClusterProximity;
    const concentrationRatio = evidence.onchainMetrics.top10HoldersRatio;

    let conviction = 0.5;
    let argument = '';

    if (sanctionsRisk > 0.05 || regulatoryRisks.length > 0 || concentrationRatio > 0.60) {
      conviction = Math.min(0.98, 0.60 + sanctionsRisk * 2 + (concentrationRatio > 0.6 ? 0.2 : 0));
      argument = `Severe systemic & regulatory liabilities detected. Proximity to sanctioned mixer clusters is ${(sanctionsRisk * 100).toFixed(2)}%, active enforcement inquiries in [${regulatoryRisks.join(', ')}]. Whale concentration at ${(concentrationRatio * 100).toFixed(1)}% presents severe exit-dump vulnerability. Recommended stance: Full defensive hedge / zero long exposure.`;
    } else {
      conviction = 0.35;
      argument = `Compliance checks pass standard thresholds, minimal sanctions nexus. General macro headwinds remain moderate.`;
    }

    return {
      agent: this.name,
      stance: 'BEARISH',
      conviction: parseFloat(conviction.toFixed(4)),
      thesis: argument,
      metricSnapshot: { sanctionsRisk, concentrationRatio, flaggedJurisdictions: regulatoryRisks }
    };
  }
}

class ChiefJusticeAgent {
  constructor(name = 'Chief-Justice-V1') {
    this.name = name;
  }

  deliberate(evidence, bullAnalysis, bearAnalysis) {
    const timestamp = Date.now();
    
    // Strict Chesterton's Fence & Karpathy Defensive Bounds:
    // If legal/sanctions risk conviction from Bear > 0.70, Bull momentum is strictly overridden.
    let finalVerdict = 'NEUTRAL';
    let targetAllocationBps = 0; // 0 to 10,000 (0% to 100%)
    let legalComplianceVerdict = 'PASSED';
    let rulingRationale = '';

    if (bearAnalysis.conviction >= 0.70) {
      finalVerdict = 'RESTRICTED_DEFENSIVE';
      targetAllocationBps = 0;
      legalComplianceVerdict = 'FAILED_DUE_DILIGENCE';
      rulingRationale = `Overriding Bull argument due to critical legal/sanctions compliance breach. Bear conviction (${bearAnalysis.conviction}) exceeds statutory risk threshold (0.70). Trading ceiling capped to 0 bps to preserve principal under legal scrutiny.`;
    } else if (bullAnalysis.conviction > bearAnalysis.conviction + 0.20) {
      finalVerdict = 'APPROVED_LONG_ACCUMULATION';
      targetAllocationBps = Math.round(1500 + (bullAnalysis.conviction - bearAnalysis.conviction) * 5000);
      targetAllocationBps = Math.min(4000, targetAllocationBps);
      rulingRationale = `Inflow & momentum metrics demonstrate statistically significant alpha (${bullAnalysis.conviction} vs ${bearAnalysis.conviction}). Regulatory risk remains sub-threshold. Authorizing controlled sizing of ${(targetAllocationBps / 100).toFixed(2)}% under dynamic stop-loss.`;
    } else {
      finalVerdict = 'HOLD_AND_OBSERVE';
      targetAllocationBps = 500; // 5% testing position
      rulingRationale = `Dialectic equilibrium: Bull momentum (${bullAnalysis.conviction}) does not sufficiently outweigh Bear cautionary metrics (${bearAnalysis.conviction}). Capital preservation rules dictate neutral observation.`;
    }

    const decisionRecord = {
      timestamp,
      asset: evidence.asset,
      verdict: finalVerdict,
      legalComplianceVerdict,
      targetAllocationBps,
      rulingRationale,
      judges: {
        bull: bullAnalysis,
        bear: bearAnalysis
      }
    };

    // Construct cryptographic Merkle Audit Trail
    const leafNodes = [
      { step: 'RAW_EVIDENCE_DIGEST', data: evidence },
      { step: 'BULL_ARGUMENT_VECTOR', data: bullAnalysis },
      { step: 'BEAR_ARGUMENT_VECTOR', data: bearAnalysis },
      { step: 'FINAL_JUSTICE_RULING', data: decisionRecord }
    ];

    const auditTree = new MerkleTree(leafNodes);
    const merkleRoot = auditTree.getRoot();

    return {
      receiptId: `VD-${timestamp.toString(36).toUpperCase()}-${merkleRoot.substring(0, 8)}`,
      timestamp,
      asset: evidence.asset,
      verdict: finalVerdict,
      allocationPercentage: (targetAllocationBps / 100).toFixed(2) + '%',
      merkleRoot,
      auditTree,
      decisionRecord,
      verifiableLeaves: leafNodes
    };
  }
}

class VerdictDeskEngine {
  constructor() {
    this.bullAgent = new BullAgent();
    this.bearAgent = new BearAgent();
    this.justiceAgent = new ChiefJusticeAgent();
  }

  processCase(evidence) {
    const bullOutput = this.bullAgent.evaluate(evidence);
    const bearOutput = this.bearAgent.evaluate(evidence);
    const ruling = this.justiceAgent.deliberate(evidence, bullOutput, bearOutput);
    return ruling;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VerdictDeskEngine, BullAgent, BearAgent, ChiefJusticeAgent };
}
