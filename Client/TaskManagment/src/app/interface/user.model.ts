// user.model.ts
export interface UserDto {
  username : string;
  role : string;
  fullName: string;
  localId: number;

}
export interface Roledto {
  Roles : string;
}
export interface priorityDto {
  priorityId: number;
  priorityName: string;
}
export interface StatusDto {
     id: number,
    name: string,
    isactive: string
}
