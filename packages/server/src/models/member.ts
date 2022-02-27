import { PrismaType } from "../types";
import { Member } from "../schema/types";
import { FormatConverter, GraphQLModelType } from "./base";

export const memberDBFields = ['id', 'role'];

//==============================================================
/* #region Custom Components */
//==============================================================

export const memberFormatter = (): FormatConverter<Member> => ({
    relationshipMap: {
        '__typename': GraphQLModelType.Member,
        'organization': GraphQLModelType.Organization,
        'user': GraphQLModelType.User,
    }
})

//==============================================================
/* #endregion Custom Components */
//==============================================================

//==============================================================
/* #region Model */
//==============================================================

export function MemberModel(prisma: PrismaType) {
    const prismaObject = prisma.organization_users;
    const format = memberFormatter();

    return {
        prisma,
        prismaObject,
        ...format,
    }
}

//==============================================================
/* #endregion Model */
//==============================================================