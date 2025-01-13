export interface MonitorRes {
  data: Data;
  message: Message;
}

export interface Data {
  monitors: Monitor[];
  trafficInfos?: TrafficInfo[];
  trafficInfoCategories?: TrafficInfoCategory[];
  trafficInfoCategoryGroups?: TrafficInfoCategoryGroup[];
}

export interface Monitor {
  locationStop: LocationStop;
  lines: Line[];
  refTrafficInfoNames: string[];
  attributes: Attributes3;
}

export interface LocationStop {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  name: string;
  title: string;
  municipality: string;
  municipalityId: number;
  type: string;
  coordName: string;
  gate: string;
  attributes: Attributes;
}

export interface Attributes {
  rbl: number;
}

export interface Line {
  name: string;
  towards: string;
  direction: string;
  platform: string;
  richtungsId: string;
  barrierFree: boolean;
  realtimeSupported: boolean;
  trafficjam: boolean;
  departures: Departures;
  type: string;
  lineId: number;
}

export interface Departures {
  departure: Departure[];
}

export interface Departure {
  departureTime: DepartureTime;
  vehicle?: Vehicle;
}

export interface DepartureTime {
  timePlanned: string;
  timeReal?: string;
  countdown: number;
}

export interface Vehicle {
  name: string;
  towards: string;
  direction: string;
  platform: string;
  richtungsId: string;
  barrierFree: boolean;
  foldingRamp?: boolean;
  foldingRampType?: string;
  realtimeSupported: boolean;
  trafficjam: boolean;
  type: string;
  attributes: Attributes2;
  linienId: number;
}

export interface Attributes2 {}

export interface Attributes3 {}

export interface TrafficInfo {
  refTrafficInfoCategoryId: number;
  name: string;
  priority: string;
  owner: string;
  title: string;
  description: string;
  time: Time;
  attributes: Attributes4;
  relatedLines: string[];
  relatedStops: number[];
}

export interface Time {
  start: string;
  end: string;
  resume: string;
}

export interface Attributes4 {
  relatedLineTypes: RelatedLineTypes;
}

export interface RelatedLineTypes {
  U3: string;
}

export interface TrafficInfoCategory {
  id: number;
  refTrafficInfoCategoryGroupId: number;
  name: string;
  trafficInfoNameList: string;
  title: string;
}

export interface TrafficInfoCategoryGroup {
  id: number;
  name: string;
}

export interface Message {
  value: string;
  messageCode: number;
  serverTime: string;
}
