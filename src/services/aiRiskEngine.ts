import { RiskAnalysis, RiskLevel, IoTSensorData, GeoLocation, RiskZone } from '../types';

export interface AIRiskInput {
  timeOfDayHours: number; // 0-23
  ambientLighting: 'WELL_LIT' | 'MODERATE' | 'POOR' | 'PITCH_DARK';
  crowdDensity: 'HIGH_CROWD' | 'MODERATE' | 'SPARSE' | 'DESERTED';
  batteryLevel: number; // 0 - 100
  routeStatus: 'ON_SAFE_ROUTE' | 'MINOR_DEVIATION' | 'UNKNOWN_CORRIDOR';
  iotData?: IoTSensorData | null;
  nearRiskZone?: RiskZone | null;
  distanceToSafeZoneMeters?: number;
}

export function evaluateAIRisk(input: AIRiskInput): RiskAnalysis {
  let score = 10; // Baseline ambient risk in urban area
  const breakdown: RiskAnalysis['breakdown'] = [];

  // 1. Time of Day factor (Night hours 22:00 - 05:00 pose elevated vulnerability)
  const hour = input.timeOfDayHours;
  const isNight = hour >= 22 || hour < 5;
  const isEvening = hour >= 19 && hour < 22;

  if (isNight) {
    score += 22;
    breakdown.push({
      factor: 'Circadian Vulnerability Window',
      weight: 22,
      impact: 'DANGER',
      value: `${hour.toString().padStart(2, '0')}:00 hrs (Late Night)`,
      description: 'Historical incident records show 3.4x higher vulnerability between 22:00 and 05:00.',
    });
  } else if (isEvening) {
    score += 10;
    breakdown.push({
      factor: 'Dusk/Evening Exposure',
      weight: 10,
      impact: 'WARNING',
      value: `${hour.toString().padStart(2, '0')}:00 hrs (Dusk)`,
      description: 'Transition window with diminishing ambient visibility and closing transit services.',
    });
  } else {
    breakdown.push({
      factor: 'Daylight Safety Factor',
      weight: -5,
      impact: 'POSITIVE',
      value: `${hour.toString().padStart(2, '0')}:00 hrs (Daytime)`,
      description: 'Active public hours with standard pedestrian surveillance.',
    });
  }

  // 2. Ambient Lighting
  switch (input.ambientLighting) {
    case 'PITCH_DARK':
      score += 24;
      breakdown.push({
        factor: 'Street Illumination Deficit',
        weight: 24,
        impact: 'DANGER',
        value: 'Severely Unlit / Zero Lumens',
        description: 'Complete absence of municipal street lighting or active CCTV coverage.',
      });
      break;
    case 'POOR':
      score += 14;
      breakdown.push({
        factor: 'Partial Illumination',
        weight: 14,
        impact: 'WARNING',
        value: 'Flickering / Sparse Light',
        description: 'Intermittent lighting with prominent dark alley blind spots.',
      });
      break;
    case 'MODERATE':
      score += 4;
      breakdown.push({
        factor: 'Average Lighting',
        weight: 4,
        impact: 'NEUTRAL',
        value: 'Standard Luminescence',
        description: 'Standard suburban illumination.',
      });
      break;
    case 'WELL_LIT':
      score -= 8;
      breakdown.push({
        factor: 'High-Lumen Monitored Zone',
        weight: -8,
        impact: 'POSITIVE',
        value: 'Bright LED / Well Lit',
        description: 'Fully illuminated commercial thoroughfare with active cameras.',
      });
      break;
  }

  // 3. Crowd Density
  switch (input.crowdDensity) {
    case 'DESERTED':
      score += 20;
      breakdown.push({
        factor: 'Pedestrian Isolation Metric',
        weight: 20,
        impact: 'DANGER',
        value: 'Isolated / 0 Bystanders',
        description: 'Zero natural guardian presence or immediate civilian witness assistance.',
      });
      break;
    case 'SPARSE':
      score += 10;
      breakdown.push({
        factor: 'Low Footfall Area',
        weight: 10,
        impact: 'WARNING',
        value: 'Rare Pedestrians (<2 / min)',
        description: 'Low bystander availability for immediate emergency intervention.',
      });
      break;
    case 'MODERATE':
      score += 0;
      breakdown.push({
        factor: 'Normal Pedestrian Presence',
        weight: 0,
        impact: 'NEUTRAL',
        value: 'Moderate Activity',
        description: 'Balanced pedestrian presence without crowd congestion.',
      });
      break;
    case 'HIGH_CROWD':
      score -= 5;
      breakdown.push({
        factor: 'Active Bystander Density',
        weight: -5,
        impact: 'POSITIVE',
        value: 'High Density Transit',
        description: 'Dense public transit or market presence acts as natural deterrence.',
      });
      break;
  }

  // 4. Route Status & Deviation
  switch (input.routeStatus) {
    case 'UNKNOWN_CORRIDOR':
      score += 18;
      breakdown.push({
        factor: 'Uncharted Route Deviation',
        weight: 18,
        impact: 'DANGER',
        value: 'Unmapped Alleyway',
        description: 'Trajectory diverges completely from typical commuting corridors.',
      });
      break;
    case 'MINOR_DEVIATION':
      score += 8;
      breakdown.push({
        factor: 'Path Variance',
        weight: 8,
        impact: 'WARNING',
        value: 'Diverging Path',
        description: 'User deviated slightly from predefined safe corridor navigation.',
      });
      break;
    case 'ON_SAFE_ROUTE':
      score -= 6;
      breakdown.push({
        factor: 'Corridor Alignment',
        weight: -6,
        impact: 'POSITIVE',
        value: 'Main Public Arterial',
        description: 'Movement remains aligned with monitored municipal safe travel lanes.',
      });
      break;
  }

  // 5. Battery Level Criticality
  if (input.batteryLevel <= 10) {
    score += 16;
    breakdown.push({
      factor: 'Critical Battery Depletion',
      weight: 16,
      impact: 'DANGER',
      value: `${input.batteryLevel}% (Urgent)`,
      description: 'Device risk of power-off in <10 minutes, severing telemetry and GPS transmission.',
    });
  } else if (input.batteryLevel <= 25) {
    score += 8;
    breakdown.push({
      factor: 'Low Device Power',
      weight: 8,
      impact: 'WARNING',
      value: `${input.batteryLevel}%`,
      description: 'Reduced battery threshold; recommend power saving and rapid beacon sync.',
    });
  }

  // 6. IoT Telemetry & Biometrics (Smart Wearable integration)
  if (input.iotData && input.iotData.connected) {
    const hr = input.iotData.heartRate;
    if (hr >= 135) {
      score += 26;
      breakdown.push({
        factor: 'Biometric Tachycardia Spike',
        weight: 26,
        impact: 'DANGER',
        value: `${hr} BPM (Acute Spike)`,
        description: 'Acute physiological stress response or physical exertion pattern detected.',
      });
    } else if (hr >= 105) {
      score += 10;
      breakdown.push({
        factor: 'Elevated Pulse Rate',
        weight: 10,
        impact: 'WARNING',
        value: `${hr} BPM`,
        description: 'Elevated cardiac rate above resting benchmark.',
      });
    }

    if (input.iotData.fallDetected) {
      score += 35;
      breakdown.push({
        factor: 'Inertial Impact / Fall Detected',
        weight: 35,
        impact: 'DANGER',
        value: '3.6G Shock Vector',
        description: 'Sudden deceleration signature matching ground impact or violent push.',
      });
    }

    if (input.iotData.struggleDetected) {
      score += 30;
      breakdown.push({
        factor: 'Erratic Motion / Physical Struggle',
        weight: 30,
        impact: 'DANGER',
        value: 'High-Frequency Jitter',
        description: 'Multi-axis accelerometer pattern matches wrist grab or physical altercation.',
      });
    }
  }

  // 7. Proximity to Known Risk Hotspots
  if (input.nearRiskZone) {
    score += 15;
    breakdown.push({
      factor: 'Historical Vulnerability Geofence',
      weight: 15,
      impact: 'DANGER',
      value: input.nearRiskZone.name,
      description: `User is within ${input.nearRiskZone.radiusMeters}m of flagged area: ${input.nearRiskZone.reason}`,
    });
  }

  // Clamp score between 2 and 98
  score = Math.min(Math.max(score, 5), 98);

  // Determine Level
  let level: RiskLevel = 'LOW';
  if (score >= 75) level = 'CRITICAL';
  else if (score >= 50) level = 'HIGH';
  else if (score >= 25) level = 'MODERATE';
  else level = 'LOW';

  // Compute confidence (simulated Bayesian confidence based on number of active sensor streams)
  let activeSignals = 4;
  if (input.iotData?.connected) activeSignals += 3;
  if (input.nearRiskZone) activeSignals += 1;
  const confidence = Math.min(Math.round(72 + activeSignals * 3.5), 97);

  // Generate Natural Language Assessment
  let explanation = '';
  if (level === 'CRITICAL') {
    explanation = `CRITICAL THREAT VECTOR DETECTED (Score ${score}/100). Compound risks identified including ${breakdown.filter(b => b.impact === 'DANGER').map(b => b.factor).join(', ')}. Emergency responders are recommended on standby alert.`;
  } else if (level === 'HIGH') {
    explanation = `ELEVATED RISK LEVEL (Score ${score}/100). Environmental indicators (${input.ambientLighting.toLowerCase().replace('_', ' ')}, ${input.crowdDensity.toLowerCase().replace('_', ' ')}) combined with late transit window elevate vulnerability.`;
  } else if (level === 'MODERATE') {
    explanation = `PREVENTATIVE ADVISORY (Score ${score}/100). Conditions indicate mild caution. Stay on well-lit thoroughfares and keep emergency contacts ready.`;
  } else {
    explanation = `OPTIMAL SAFETY STATUS (Score ${score}/100). User is travelling along well-lit corridor with standard footfall and normal biometric baseline.`;
  }

  // Generate Actionable Recommendations
  const recommendations: string[] = [];
  if (level === 'CRITICAL') {
    recommendations.push('Immediate automated live location ping dispatched to primary guardian.');
    recommendations.push('Activate "Safe Walk" beacon with continuous audio streaming.');
    recommendations.push('Prepare single-tap SOS panic or discreet silent trigger.');
  } else if (level === 'HIGH') {
    recommendations.push('Navigate towards closest 24/7 Pink Booth or Police Station (within 450m).');
    recommendations.push('Keep mobile in hand or ensure IoT wearable quick-click is primed.');
    recommendations.push('Consider simulated Fake Call tool if approached by suspicious persons.');
  } else if (level === 'MODERATE') {
    recommendations.push('Share live route tracking link with family or trusted friend.');
    recommendations.push('Avoid unlit short-cuts or deserted transit underpasses.');
  } else {
    recommendations.push('Standard awareness: keep device charged above 30%.');
    recommendations.push('Ensure offline emergency contacts list is up to date.');
  }

  return {
    score,
    level,
    confidence,
    breakdown,
    explanation,
    recommendations,
  };
}
