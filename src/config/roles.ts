const allRoles = {
    tester: ['manageTests', 'manageReports', 'manageProjects', 'manageCollabs'],
    developer: ['manageReports', 'manageCollabs'],
    projectManager: ['manageReports', 'manageCollabs'],
};
  
const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));
  
export {
    roles,
    roleRights,
};
  