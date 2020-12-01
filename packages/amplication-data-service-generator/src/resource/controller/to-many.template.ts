import * as common from "@nestjs/common";
import * as nestMorgan from "nest-morgan";
import * as nestAccessControl from "nest-access-control";
// @ts-ignore
import * as basicAuthGuard from "../auth/basicAuth.guard";
// @ts-ignore
import * as abacUtil from "../auth/abac.util";

declare interface WHERE_UNIQUE_INPUT {}
declare interface RELATED_ENTITY_WHERE_UNIQUE_INPUT {}
declare interface RELATED_ENTITY_WHERE_INPUT {}
declare interface Select {}

declare interface RELATED_ENTITY {}

declare interface SERVICE {
  findOne(args: {
    where: WHERE_UNIQUE_INPUT;
  }): {
    PROPERTY(args: {
      where: RELATED_ENTITY_WHERE_INPUT;
      select: Select;
    }): Promise<RELATED_ENTITY[]>;
  };
  update(args: {
    where: WHERE_UNIQUE_INPUT;
    data: {
      PROPERTY: {
        set?: RELATED_ENTITY_WHERE_UNIQUE_INPUT[];
        connect?: RELATED_ENTITY_WHERE_UNIQUE_INPUT[];
        disconnect?: RELATED_ENTITY_WHERE_UNIQUE_INPUT[];
      };
    };
    select: { id: true };
  }): Promise<void>;
}

declare const ENTITY_NAME: string;
declare const RELATED_ENTITY_NAME: string;
declare const FIND_MANY_PATH: string;
declare const CREATE_PATH: string;
declare const DELETE_PATH: string;
declare const UPDATE_PATH: string;
declare const SELECT: Select;

export class Mixin {
  constructor(
    private readonly service: SERVICE,
    private readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @common.UseInterceptors(nestMorgan.MorganInterceptor("combined"))
  @common.UseGuards(basicAuthGuard.BasicAuthGuard, nestAccessControl.ACGuard)
  @common.Get(FIND_MANY_PATH)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  async FIND_MANY(
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @common.Query() query: RELATED_ENTITY_WHERE_INPUT,
    @nestAccessControl.UserRoles() userRoles: string[]
  ): Promise<RELATED_ENTITY[]> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "any",
      resource: RELATED_ENTITY_NAME,
    });
    const results = await this.service
      .findOne({ where: params })
      .PROPERTY({ where: query, select: SELECT });
    return results.map((result) => permission.filter(result));
  }

  @common.UseInterceptors(nestMorgan.MorganInterceptor("combined"))
  @common.UseGuards(basicAuthGuard.BasicAuthGuard, nestAccessControl.ACGuard)
  @common.Post(CREATE_PATH)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  async CREATE(
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @common.Body() body: WHERE_UNIQUE_INPUT[],
    @nestAccessControl.UserRoles() userRoles: string[]
  ): Promise<void> {
    const data = {
      PROPERTY: {
        connect: body,
      },
    };
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "update",
      possession: "any",
      resource: ENTITY_NAME,
    });
    const invalidAttributes = abacUtil.getInvalidAttributes(permission, data);
    if (invalidAttributes.length) {
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new common.ForbiddenException(
        `Updating the relationship: ${invalidAttributes[0]} of ${ENTITY_NAME} is forbidden for roles: ${roles}`
      );
    }
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.UseInterceptors(nestMorgan.MorganInterceptor("combined"))
  @common.UseGuards(basicAuthGuard.BasicAuthGuard, nestAccessControl.ACGuard)
  @common.Patch(UPDATE_PATH)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  async UPDATE(
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @common.Body() body: WHERE_UNIQUE_INPUT[],
    @nestAccessControl.UserRoles() userRoles: string[]
  ): Promise<void> {
    const data = {
      PROPERTY: {
        set: body,
      },
    };
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "update",
      possession: "any",
      resource: ENTITY_NAME,
    });
    const invalidAttributes = abacUtil.getInvalidAttributes(permission, data);
    if (invalidAttributes.length) {
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new common.ForbiddenException(
        `Updating the relationship: ${invalidAttributes[0]} of ${ENTITY_NAME} is forbidden for roles: ${roles}`
      );
    }
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.UseInterceptors(nestMorgan.MorganInterceptor("combined"))
  @common.UseGuards(basicAuthGuard.BasicAuthGuard, nestAccessControl.ACGuard)
  @common.Delete(DELETE_PATH)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  async DELETE(
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @common.Body() body: WHERE_UNIQUE_INPUT[],
    @nestAccessControl.UserRoles() userRoles: string[]
  ): Promise<void> {
    const data = {
      PROPERTY: {
        disconnect: body,
      },
    };
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "update",
      possession: "any",
      resource: ENTITY_NAME,
    });
    const invalidAttributes = abacUtil.getInvalidAttributes(permission, data);
    if (invalidAttributes.length) {
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new common.ForbiddenException(
        `Updating the relationship: ${invalidAttributes[0]} of ${ENTITY_NAME} is forbidden for roles: ${roles}`
      );
    }
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }
}
