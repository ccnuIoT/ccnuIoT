import rawMembers from './members.json';

export type GroupSlug = 'hardware' | 'algorithm' | 'application';

export interface MemberLinks {
  github?: string;
  bilibili?: string;
  blog?: string;
}

export interface MemberRecord {
  name: string;
  avatar?: string;
  roleTags: string[];
  focus: string;
  bio: string;
  links?: MemberLinks;
}

export interface CohortRecord {
  cohort: string;
  members: MemberRecord[];
}

export type MembersData = Record<GroupSlug, CohortRecord[]>;

export const membersData = rawMembers as MembersData;

function cohortOrder(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function getGroupCohorts(group: GroupSlug): CohortRecord[] {
  return [...membersData[group]].sort((a, b) => cohortOrder(b.cohort) - cohortOrder(a.cohort));
}
