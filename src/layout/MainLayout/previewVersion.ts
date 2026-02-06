const ALLOW_BRNACH = ['0', '23', '30', '33', '41']
export const isAllowBranch = (branchCode: string) => {
    return ALLOW_BRNACH.includes(branchCode);
};