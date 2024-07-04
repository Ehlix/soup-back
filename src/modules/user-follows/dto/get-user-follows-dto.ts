export class GetUserFollowsDto {
  readonly userId?: string;
  readonly site?: string;
  readonly offset?: number;
  readonly limit?: number;
  readonly dateStart?: string;
}
