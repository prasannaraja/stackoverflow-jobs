export interface Image {
  url: string[];
  title: string[];
  link: string[];
}

export interface Location {
  place: string;
}

export interface Item {
  link: string[];
  category: string[];
  title: string[];
  description: string[];
  pubDate: string[];
  location: Location[];
}

export interface Channel {
  title: string[];
  link: string[];
  description: string[];
  image: Image[];
  item: Item[];
}

export interface Rss {
  channel: Channel[];
}

export interface StackOverFlowJobs {
  rss: Rss;
}

export interface StackOverFlowJobsExtended {
  jobId: number;
  title: string;
  location: string;
  postedDate: Date;
  link: string;
}