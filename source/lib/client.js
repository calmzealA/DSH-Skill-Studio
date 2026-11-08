window.__ModuleLoader__.load({ id: "dsh-skill-studio", factory(require) { const module = {exports:{}}; const exports = module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.mjs
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react2 = __toESM(require("react"), 1);

// src/Panel.jsx
var import_react = __toESM(require("react"), 1);

// src/locales.mjs
var en = {
  dateLocale: "en-US",
  action_update: "Update from source",
  nav: "Skills Studio",
  title: "Skills Studio",
  subtitle: "Make every skill clear, editable, and recoverable.",
  brand: "by \u8001\u9648\u804AAI",
  back: "Back to conversation",
  newSkill: "New skill",
  import: "Import",
  export: "Export",
  refresh: "Refresh",
  loading: "Loading skills\u2026",
  working: "Working\u2026",
  retry: "Try again",
  allSkills: "All skills",
  enabled: "Enabled",
  disabled: "Disabled",
  issues: "Needs attention",
  readOnly: "Read only",
  roots: "Skill locations",
  allRoots: "All locations",
  search: "Search skills, descriptions, or paths",
  searchShort: "Search skills",
  allStates: "All statuses",
  issuesOnly: "With diagnostics",
  resetFilters: "Reset filters",
  noSkills: "Your skills start here",
  noSkillsHint: "Create a skill or preview an import. Nothing is installed before you confirm.",
  noResults: "No matching skills",
  noResultsHint: "Try another keyword or change your filters.",
  skillsCount: "skills",
  selected: "selected",
  selectAll: "Select visible skills",
  clearSelection: "Clear selection",
  enable: "Enable",
  disable: "Disable",
  enableSelected: "Enable selected",
  disableSelected: "Disable selected",
  exportSelected: "Export selected",
  enabledHint: "Available to DSH discovery",
  disabledHint: "Kept on disk; excluded from discovery",
  attention: "Attention",
  shadowed: "Shadowed",
  shadowedHint: "A higher priority skill with this name takes precedence.",
  effective: "Effective",
  model: "Automatic",
  user: "Slash command",
  modelHint: "Allow the model to discover and load this skill.",
  userHint: "Allow users to invoke this skill through /name.",
  neitherHint: "Both invocation methods are off.",
  details: "Open skill",
  edit: "Edit",
  files: "Resources",
  diagnostics: "Diagnostics",
  history: "History",
  historyHint: "A snapshot is kept before changes. Restore creates another recovery point.",
  close: "Close",
  cancel: "Cancel",
  save: "Save changes",
  saved: "Changes saved",
  name: "Skill name",
  description: "Description",
  location: "Install location",
  path: "Path",
  source: "Source",
  markdown: "SKILL.md",
  editorLabel: "Skill instructions in Markdown",
  unsaved: "Unsaved changes",
  discardConfirm: "Discard unsaved changes?",
  delete: "Remove skill",
  deleteConfirm: "Remove this skill? You can restore it from History.",
  removed: "Skill moved to recovery history",
  created: "Skill created",
  createTitle: "Create a skill",
  createHint: "Give it a clear purpose. A useful description helps DSH choose it at the right time.",
  nameHint: "Lowercase letters, numbers, and hyphens. Example: research-brief",
  namePlaceholder: "research-brief",
  descriptionPlaceholder: "What this skill does, and when to use it",
  template: "Starter template",
  templateGeneral: "General workflow",
  templateResearch: "Source based research",
  templateWriting: "Content writing",
  templateCode: "Engineering review",
  create: "Create skill",
  importTitle: "Preview an import",
  importHint: "Review the exact files and any conflicts before installation.",
  github: "GitHub",
  localFiles: "Local files",
  githubUrl: "GitHub repository or skill folder URL",
  githubPlaceholder: "https://github.com/owner/repo/tree/main/skills/name",
  preview: "Preview files",
  uploadFiles: "Choose .md or .zip",
  uploadFolder: "Choose folder",
  localHint: "SKILL.md, a ZIP archive, or a skill folder including scripts and references.",
  filesChosen: "files chosen",
  clearFiles: "Clear files",
  previewTitle: "Import preview",
  commit: "Pinned commit",
  conflict: "Already exists",
  ready: "Ready to install",
  importNow: "Install reviewed skills",
  imported: "Import completed",
  importNoReady: "There are no installable skills in this preview.",
  previewExpired: "Preview expired. Please preview the source again.",
  previewCommitHint: "The reviewed commit is used for this import.",
  noWritableRoot: "No writable skill location is available.",
  chooseLocation: "Choose a skill location",
  noHistory: "No recovery points yet",
  noHistoryHint: "Edits, removals, and other changes will appear here.",
  restore: "Restore",
  restoreConfirm: "Restore this recovery point? Current files will be backed up first.",
  restored: "Recovery point restored",
  date: "Time",
  action: "Action",
  checksPass: "No issues detected",
  checksHint: "Format checks help catch mistakes. They do not certify the safety of skill instructions or scripts.",
  resourceHint: "Exports preserve scripts, references, and assets with the skill.",
  fileCount: "files",
  bytes: "bytes",
  viewFile: "View file",
  fileBinary: "Binary or large file. Export the skill to inspect it locally.",
  copy: "Copy",
  copied: "Copied",
  policy: "Invocation",
  policyHint: "Controls how DSH makes this skill available. Changes are saved with the instruction file.",
  rootHint: "If copies share a name, the skill details show which location the selected target actually uses.",
  priority: "Priority",
  rootMissing: "This location will be created when you install a skill.",
  errorTitle: "Could not complete this action",
  success: "Done",
  partial: "Some skills could not be changed",
  pending: "Please wait for the current operation.",
  exportDone: "Export ready",
  unknownError: "Something went wrong. Please try again.",
  noFile: "Choose files or a folder first.",
  chooseRoot: "Choose an installation location first.",
  invalidName: "Use lowercase letters, numbers, and single hyphens.",
  requiredDescription: "Add a description.",
  requiredUrl: "Enter a GitHub URL.",
  issue_error: "Error",
  issue_warning: "Warning",
  issue_info: "Info",
  source_user_dsh: "DSH \xB7 personal",
  source_user_agents: "Agents \xB7 personal",
  source_project_dsh: "DSH \xB7 project",
  source_project_agents: "Agents \xB7 project",
  source_custom: "Custom",
  source_bundled: "Bundled",
  source_runtime: "Runtime",
  action_save: "Edit",
  action_delete: "Remove",
  action_toggle: "Change status",
  action_import: "Import",
  action_create: "Create",
  action_restore: "Restore",
  action_saveFile: "Edit resource",
  action_deleteFile: "Remove resource",
  action_copy: "Copy",
  error_CONFLICT: "A skill with this name already exists, or its files conflict. Refresh or choose another location.",
  error_HASH_MISMATCH: "The files changed elsewhere. Reload the skill before saving.",
  error_READ_ONLY: "This skill is read only. Export or copy it to a writable location.",
  error_NOT_FOUND: "This skill is no longer available. Refresh the list.",
  error_INVALID_PATH: "The import contains an unsupported or unsafe path.",
  error_INVALID_SKILL: "The skill format is invalid. Review its diagnostics.",
  error_PREVIEW_EXPIRED: "This preview expired. Preview the source again.",
  error_LIMIT: "This import exceeds the supported size or file limit.",
  update: "Check source update",
  updateTitle: "Review source update",
  updateHint: "Compare the current skill with the fetched commit before replacing any files.",
  updateApply: "Apply reviewed update",
  updated: "Skill updated",
  previousCommit: "Installed commit",
  incomingCommit: "Incoming commit",
  currentVersion: "Current local instructions",
  incomingVersion: "Incoming instructions",
  localModified: "Local changes detected. Applying this update will replace them; a recovery snapshot is kept.",
  unchanged: "The source commit has not changed.",
  change_added: "Added",
  change_removed: "Removed",
  change_changed: "Changed",
  change_unchanged: "Unchanged",
  copySkill: "Copy to location",
  copyTitle: "Copy complete skill",
  copyHint: "Keep the original and copy its instructions and resources to another skill location.",
  skillCopied: "Skill copied",
  providerHint: "This skill is supplied by another plugin. Manage its original resources through that plugin.",
  saveResource: "Save resource",
  resourceSaved: "Resource saved",
  resourceUnsaved: "Discard unsaved resource edits?",
  resourceLabel: "Resource text editor",
  error_STALE_WRITE: "The skill changed elsewhere. Reopen it before saving.",
  error_UNSAFE_PATH: "This operation contains an unsafe path.",
  error_SYMLINK: "Symbolic links are not managed.",
  error_TOO_LARGE: "A file or archive exceeds the supported size limit.",
  error_TOO_MANY_FILES: "The skill has too many files.",
  error_NO_SKILLS: "No valid skill instructions were found.",
  error_ROOT_NOT_FOUND: "The selected location is unavailable.",
  error_INVALID_NAME: "Use lowercase letters, numbers, and single hyphens.",
  error_NAME_MISMATCH: "The update must keep the same skill name.",
  error_NOT_BUNDLE: "Copy this flat skill to a directory bundle before updating its resources.",
  diagnostic_MISSING_FRONTMATTER: "Add a YAML header containing name and description.",
  diagnostic_INVALID_YAML: "The YAML header could not be parsed.",
  diagnostic_INVALID_NAME: "Use a lowercase kebab-case name, for example research-notes.",
  diagnostic_MISSING_DESCRIPTION: "Add a nonempty routing description.",
  diagnostic_LONG_DESCRIPTION: "Keep the description under 1024 characters.",
  diagnostic_LEGACY_INVOCATION: "Use disable-model-invocation and user-invocable for invocation controls.",
  diagnostic_INVALID_INVOCATION: "Invocation controls must use the boolean values true or false.",
  diagnostic_EMPTY_BODY: "Add instructions below the YAML header.",
  diagnostic_LONG_BODY: "Move long reference material into references/.",
  diagnostic_DUPLICATE_INSTRUCTION: "Both enabled and disabled instruction files exist.",
  diagnostic_TOO_LARGE: "The instruction file exceeds the supported size limit.",
  diagnostic_SYMLINK: "The skill contains an unsupported symbolic link.",
  diagnostic_READ_FAILED: "Some skill files could not be read.",
  templateGeneralDescription: "A clear, repeatable workflow with explicit inputs, steps, and checks.",
  templateGeneralBody: "# Workflow\n\n## Inputs\nDescribe the information required to start.\n\n## Steps\n1. Check the request and available context.\n2. Complete the work using the appropriate tools.\n3. Verify the result against the user\u2019s requirements.\n\n## Output\nState the result clearly and cite relevant evidence.\n",
  templateResearchBody: "# Research workflow\n\n## Gather evidence\nStart with primary sources. Record publication dates and direct links.\n\n## Analyze\nSeparate confirmed findings from assumptions. Compare conflicting evidence and explain uncertainty.\n\n## Deliver\nLead with the answer, provide the supporting evidence, and include the sources used.\n",
  templateWritingBody: "# Writing workflow\n\n## Understand\nIdentify the audience, platform, purpose, and constraints.\n\n## Draft\nLead with a concrete point. Use connected paragraphs and verify factual claims.\n\n## Review\nRemove generic phrasing, unsupported claims, and repetition. Check length and requested format.\n",
  templateCodeBody: "# Engineering review\n\n## Inspect\nRead the relevant code and repository instructions before making changes.\n\n## Review\nTrace the behavior, identify concrete failure cases, and check compatibility and error handling.\n\n## Verify\nRun meaningful checks. Report findings with file paths and practical impact.\n"
};
Object.assign(en, { catalogIncomplete: "Some skill locations could not be fully read. The catalog may be incomplete.", addResource: "Add text resource", resourcePath: "Resource path", resourcePathHint: "For example references/checklist.md or scripts/helper.py", removeResource: "Remove resource", removeResourceConfirm: "Remove this resource? The full skill is backed up first.", resourceRemoved: "Resource removed", reviewFiles: "Changed resources", updateOverview: "Review both instructions and resource changes.", noChanges: "No files changed.", invalidResource: "Enter a relative file path." });
var zh = {
  dateLocale: "zh-CN",
  action_update: "\u6765\u6E90\u66F4\u65B0",
  nav: "\u6280\u80FD\u5DE5\u4F5C\u53F0",
  title: "\u6280\u80FD\u5DE5\u4F5C\u53F0",
  subtitle: "\u770B\u6E05\u6280\u80FD\u3001\u968F\u624B\u4FEE\u6539\uFF0C\u6BCF\u6B21\u53D8\u66F4\u90FD\u53EF\u6062\u590D\u3002",
  brand: "\u8001\u9648\u804AAI \u51FA\u54C1",
  back: "\u8FD4\u56DE\u4F1A\u8BDD",
  newSkill: "\u65B0\u5EFA\u6280\u80FD",
  import: "\u5BFC\u5165\u6280\u80FD",
  export: "\u5BFC\u51FA",
  refresh: "\u5237\u65B0",
  loading: "\u6B63\u5728\u8BFB\u53D6\u6280\u80FD\u2026",
  working: "\u6B63\u5728\u5904\u7406\u2026",
  retry: "\u91CD\u8BD5",
  allSkills: "\u5168\u90E8\u6280\u80FD",
  enabled: "\u5DF2\u542F\u7528",
  disabled: "\u5DF2\u505C\u7528",
  issues: "\u9700\u8981\u68C0\u67E5",
  readOnly: "\u53EA\u8BFB",
  roots: "\u6280\u80FD\u4F4D\u7F6E",
  allRoots: "\u5168\u90E8\u4F4D\u7F6E",
  search: "\u641C\u7D22\u6280\u80FD\u3001\u63CF\u8FF0\u6216\u8DEF\u5F84",
  searchShort: "\u641C\u7D22\u6280\u80FD",
  allStates: "\u5168\u90E8\u72B6\u6001",
  issuesOnly: "\u4EC5\u770B\u8BCA\u65AD\u95EE\u9898",
  resetFilters: "\u91CD\u7F6E\u7B5B\u9009",
  noSkills: "\u4ECE\u8FD9\u91CC\u5F00\u59CB\u7BA1\u7406\u6280\u80FD",
  noSkillsHint: "\u65B0\u5EFA\u4E00\u4E2A\u6280\u80FD\uFF0C\u6216\u5148\u9884\u89C8\u5BFC\u5165\u5185\u5BB9\u3002\u786E\u8BA4\u540E\u624D\u4F1A\u5B89\u88C5\u3002",
  noResults: "\u6CA1\u6709\u627E\u5230\u5339\u914D\u6280\u80FD",
  noResultsHint: "\u6362\u4E2A\u5173\u952E\u8BCD\uFF0C\u6216\u8C03\u6574\u7B5B\u9009\u6761\u4EF6\u3002",
  skillsCount: "\u4E2A\u6280\u80FD",
  selected: "\u9879\u5DF2\u9009",
  selectAll: "\u9009\u62E9\u5F53\u524D\u7B5B\u9009\u51FA\u7684\u6280\u80FD",
  clearSelection: "\u6E05\u7A7A\u9009\u62E9",
  enable: "\u542F\u7528",
  disable: "\u505C\u7528",
  enableSelected: "\u542F\u7528\u6240\u9009",
  disableSelected: "\u505C\u7528\u6240\u9009",
  exportSelected: "\u5BFC\u51FA\u6240\u9009",
  enabledHint: "\u53C2\u4E0E DSH \u6280\u80FD\u53D1\u73B0",
  disabledHint: "\u4FDD\u7559\u6587\u4EF6\uFF0C\u4E0D\u53C2\u4E0E\u6280\u80FD\u53D1\u73B0",
  attention: "\u5F85\u68C0\u67E5",
  shadowed: "\u88AB\u540C\u540D\u6280\u80FD\u8986\u76D6",
  shadowedHint: "\u540C\u540D\u6280\u80FD\u4E2D\uFF0C\u6709\u66F4\u9AD8\u4F18\u5148\u7EA7\u7684\u6765\u6E90\u5148\u4E8E\u5B83\u751F\u6548\u3002",
  effective: "\u751F\u6548",
  model: "\u81EA\u52A8\u8C03\u7528",
  user: "\u659C\u6760\u547D\u4EE4",
  modelHint: "\u5141\u8BB8\u6A21\u578B\u53D1\u73B0\u5E76\u52A0\u8F7D\u8FD9\u4E2A\u6280\u80FD\u3002",
  userHint: "\u5141\u8BB8\u7528\u6237\u901A\u8FC7 /\u540D\u79F0 \u8C03\u7528\u3002",
  neitherHint: "\u4E24\u79CD\u8C03\u7528\u65B9\u5F0F\u5747\u5DF2\u5173\u95ED\u3002",
  details: "\u67E5\u770B\u6280\u80FD",
  edit: "\u7F16\u8F91",
  files: "\u8D44\u6E90\u6587\u4EF6",
  diagnostics: "\u8BCA\u65AD",
  history: "\u53D8\u66F4\u5386\u53F2",
  historyHint: "\u53D8\u66F4\u524D\u4FDD\u7559\u5FEB\u7167\uFF1B\u6062\u590D\u65F6\u4E5F\u4F1A\u4FDD\u5B58\u5F53\u524D\u7248\u672C\u3002",
  close: "\u5173\u95ED",
  cancel: "\u53D6\u6D88",
  save: "\u4FDD\u5B58\u4FEE\u6539",
  saved: "\u5DF2\u4FDD\u5B58\u4FEE\u6539",
  name: "\u6280\u80FD\u540D\u79F0",
  description: "\u6280\u80FD\u63CF\u8FF0",
  location: "\u5B89\u88C5\u4F4D\u7F6E",
  path: "\u6587\u4EF6\u8DEF\u5F84",
  source: "\u6765\u6E90",
  markdown: "SKILL.md",
  editorLabel: "Markdown \u6280\u80FD\u6307\u4EE4\u7F16\u8F91\u5668",
  unsaved: "\u5C1A\u672A\u4FDD\u5B58",
  discardConfirm: "\u653E\u5F03\u5C1A\u672A\u4FDD\u5B58\u7684\u4FEE\u6539\uFF1F",
  delete: "\u79FB\u9664\u6280\u80FD",
  deleteConfirm: "\u79FB\u9664\u8FD9\u4E2A\u6280\u80FD\uFF1F\u4E4B\u540E\u53EF\u4EE5\u5728\u53D8\u66F4\u5386\u53F2\u4E2D\u6062\u590D\u3002",
  removed: "\u6280\u80FD\u5DF2\u79FB\u5165\u53EF\u6062\u590D\u5386\u53F2",
  created: "\u6280\u80FD\u5DF2\u521B\u5EFA",
  createTitle: "\u65B0\u5EFA\u4E00\u4E2A\u6280\u80FD",
  createHint: "\u5199\u6E05\u7528\u9014\u548C\u9002\u7528\u573A\u666F\uFF0CDSH \u624D\u80FD\u5728\u5408\u9002\u7684\u65F6\u5019\u9009\u4E2D\u5B83\u3002",
  nameHint: "\u4F7F\u7528\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u8FDE\u5B57\u7B26\uFF0C\u4F8B\u5982 research-brief",
  namePlaceholder: "research-brief",
  descriptionPlaceholder: "\u8FD9\u4E2A\u6280\u80FD\u505A\u4EC0\u4E48\uFF0C\u4EC0\u4E48\u60C5\u51B5\u4E0B\u5E94\u8BE5\u4F7F\u7528",
  template: "\u8D77\u6B65\u6A21\u677F",
  templateGeneral: "\u901A\u7528\u5DE5\u4F5C\u6D41",
  templateResearch: "\u8D44\u6599\u7814\u7A76",
  templateWriting: "\u5185\u5BB9\u5199\u4F5C",
  templateCode: "\u4EE3\u7801\u5BA1\u67E5",
  create: "\u521B\u5EFA\u6280\u80FD",
  importTitle: "\u9884\u89C8\u5E76\u5BFC\u5165\u6280\u80FD",
  importHint: "\u5148\u68C0\u67E5\u5B9E\u9645\u6587\u4EF6\u548C\u540C\u540D\u51B2\u7A81\uFF0C\u518D\u786E\u8BA4\u5B89\u88C5\u3002",
  github: "GitHub",
  localFiles: "\u672C\u5730\u6587\u4EF6",
  githubUrl: "GitHub \u4ED3\u5E93\u6216\u6280\u80FD\u6587\u4EF6\u5939\u7F51\u5740",
  githubPlaceholder: "https://github.com/owner/repo/tree/main/skills/name",
  preview: "\u9884\u89C8\u6587\u4EF6",
  uploadFiles: "\u9009\u62E9 .md / .zip",
  uploadFolder: "\u9009\u62E9\u6587\u4EF6\u5939",
  localHint: "\u652F\u6301 SKILL.md\u3001ZIP \u538B\u7F29\u5305\uFF0C\u6216\u5305\u542B\u811A\u672C\u4E0E\u53C2\u8003\u8D44\u6599\u7684\u5B8C\u6574\u6280\u80FD\u6587\u4EF6\u5939\u3002",
  filesChosen: "\u4E2A\u6587\u4EF6\u5DF2\u9009",
  clearFiles: "\u6E05\u7A7A\u6587\u4EF6",
  previewTitle: "\u5BFC\u5165\u9884\u89C8",
  commit: "\u56FA\u5B9A\u63D0\u4EA4",
  conflict: "\u5DF2\u5B58\u5728\u540C\u540D\u6280\u80FD",
  ready: "\u53EF\u4EE5\u5B89\u88C5",
  importNow: "\u5B89\u88C5\u5DF2\u68C0\u67E5\u7684\u6280\u80FD",
  imported: "\u6280\u80FD\u5BFC\u5165\u5B8C\u6210",
  importNoReady: "\u8FD9\u6B21\u9884\u89C8\u6CA1\u6709\u53EF\u5B89\u88C5\u7684\u6280\u80FD\u3002",
  previewExpired: "\u9884\u89C8\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u9884\u89C8\u6765\u6E90\u3002",
  previewCommitHint: "\u672C\u6B21\u5B89\u88C5\u4F7F\u7528\u5DF2\u7ECF\u68C0\u67E5\u8FC7\u7684\u63D0\u4EA4\u7248\u672C\u3002",
  noWritableRoot: "\u5F53\u524D\u6CA1\u6709\u53EF\u5199\u5165\u7684\u6280\u80FD\u4F4D\u7F6E\u3002",
  chooseLocation: "\u9009\u62E9\u6280\u80FD\u4F4D\u7F6E",
  noHistory: "\u8FD8\u6CA1\u6709\u6062\u590D\u70B9",
  noHistoryHint: "\u7F16\u8F91\u3001\u79FB\u9664\u7B49\u53D8\u66F4\u4F1A\u8BB0\u5F55\u5728\u8FD9\u91CC\u3002",
  restore: "\u6062\u590D",
  restoreConfirm: "\u6062\u590D\u5230\u8FD9\u4E2A\u5FEB\u7167\uFF1F\u5F53\u524D\u6587\u4EF6\u4F1A\u5148\u5907\u4EFD\u3002",
  restored: "\u5DF2\u6062\u590D\u5FEB\u7167",
  date: "\u65F6\u95F4",
  action: "\u64CD\u4F5C",
  checksPass: "\u672A\u53D1\u73B0\u683C\u5F0F\u95EE\u9898",
  checksHint: "\u683C\u5F0F\u68C0\u67E5\u7528\u4E8E\u53D1\u73B0\u5E38\u89C1\u9519\u8BEF\uFF0C\u4E0D\u4EE3\u8868\u6307\u4EE4\u6216\u811A\u672C\u7ECF\u8FC7\u5B89\u5168\u8BA4\u8BC1\u3002",
  resourceHint: "\u5BFC\u51FA\u4F1A\u4FDD\u7559\u6280\u80FD\u7684\u811A\u672C\u3001\u53C2\u8003\u8D44\u6599\u548C\u5176\u4ED6\u8D44\u6E90\u3002",
  fileCount: "\u4E2A\u6587\u4EF6",
  bytes: "\u5B57\u8282",
  viewFile: "\u67E5\u770B\u6587\u4EF6",
  fileBinary: "\u8FD9\u662F\u4E8C\u8FDB\u5236\u6216\u8F83\u5927\u7684\u6587\u4EF6\uFF0C\u8BF7\u5BFC\u51FA\u540E\u5728\u672C\u5730\u67E5\u770B\u3002",
  copy: "\u590D\u5236",
  copied: "\u5DF2\u590D\u5236",
  policy: "\u8C03\u7528\u65B9\u5F0F",
  policyHint: "\u51B3\u5B9A DSH \u5982\u4F55\u63D0\u4F9B\u8FD9\u4E2A\u6280\u80FD\uFF0C\u4FEE\u6539\u4F1A\u968F\u6307\u4EE4\u6587\u4EF6\u4E00\u8D77\u4FDD\u5B58\u3002",
  rootHint: "\u540C\u540D\u6280\u80FD\u53EF\u80FD\u6765\u81EA\u591A\u4E2A\u4F4D\u7F6E\uFF1B\u6280\u80FD\u8BE6\u60C5\u4F1A\u663E\u793A\u5F53\u524D\u76EE\u6807\u5B9E\u9645\u4F7F\u7528\u7684\u7248\u672C\u3002",
  priority: "\u4F18\u5148\u7EA7",
  rootMissing: "\u5B89\u88C5\u6280\u80FD\u65F6\u4F1A\u81EA\u52A8\u521B\u5EFA\u8FD9\u4E2A\u4F4D\u7F6E\u3002",
  errorTitle: "\u64CD\u4F5C\u672A\u5B8C\u6210",
  success: "\u5DF2\u5B8C\u6210",
  partial: "\u90E8\u5206\u6280\u80FD\u672A\u80FD\u4FEE\u6539",
  pending: "\u8BF7\u7B49\u5F85\u5F53\u524D\u64CD\u4F5C\u5B8C\u6210\u3002",
  exportDone: "\u5BFC\u51FA\u6587\u4EF6\u5DF2\u51C6\u5907\u597D",
  unknownError: "\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  noFile: "\u8BF7\u5148\u9009\u62E9\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u3002",
  chooseRoot: "\u8BF7\u5148\u9009\u62E9\u5B89\u88C5\u4F4D\u7F6E\u3002",
  invalidName: "\u540D\u79F0\u8BF7\u4F7F\u7528\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u5355\u4E2A\u8FDE\u5B57\u7B26\u3002",
  requiredDescription: "\u8BF7\u586B\u5199\u6280\u80FD\u63CF\u8FF0\u3002",
  requiredUrl: "\u8BF7\u586B\u5199 GitHub \u7F51\u5740\u3002",
  issue_error: "\u9519\u8BEF",
  issue_warning: "\u63D0\u793A",
  issue_info: "\u4FE1\u606F",
  source_user_dsh: "DSH \xB7 \u4E2A\u4EBA",
  source_user_agents: "Agents \xB7 \u4E2A\u4EBA",
  source_project_dsh: "DSH \xB7 \u9879\u76EE",
  source_project_agents: "Agents \xB7 \u9879\u76EE",
  source_custom: "\u81EA\u5B9A\u4E49",
  source_bundled: "\u968F\u63D2\u4EF6\u63D0\u4F9B",
  source_runtime: "\u8FD0\u884C\u65F6",
  action_save: "\u7F16\u8F91",
  action_delete: "\u79FB\u9664",
  action_toggle: "\u5207\u6362\u72B6\u6001",
  action_import: "\u5BFC\u5165",
  action_create: "\u65B0\u5EFA",
  action_restore: "\u6062\u590D",
  action_saveFile: "\u7F16\u8F91\u8D44\u6E90",
  action_deleteFile: "\u79FB\u9664\u8D44\u6E90",
  action_copy: "\u590D\u5236",
  error_CONFLICT: "\u76EE\u6807\u4F4D\u7F6E\u5B58\u5728\u540C\u540D\u6280\u80FD\uFF0C\u6216\u6587\u4EF6\u72B6\u6001\u53D1\u751F\u51B2\u7A81\u3002\u8BF7\u5237\u65B0\u6216\u9009\u62E9\u5176\u4ED6\u4F4D\u7F6E\u3002",
  error_HASH_MISMATCH: "\u6587\u4EF6\u5DF2\u88AB\u5176\u4ED6\u64CD\u4F5C\u4FEE\u6539\uFF0C\u8BF7\u91CD\u65B0\u8BFB\u53D6\u6280\u80FD\u540E\u518D\u4FDD\u5B58\u3002",
  error_READ_ONLY: "\u8FD9\u4E2A\u6280\u80FD\u53EA\u8BFB\uFF0C\u53EF\u4EE5\u5BFC\u51FA\u6216\u590D\u5236\u5230\u53EF\u5199\u4F4D\u7F6E\u3002",
  error_NOT_FOUND: "\u8FD9\u4E2A\u6280\u80FD\u5DF2\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5237\u65B0\u5217\u8868\u3002",
  error_INVALID_PATH: "\u5BFC\u5165\u4E2D\u5305\u542B\u4E0D\u652F\u6301\u6216\u4E0D\u5B89\u5168\u7684\u8DEF\u5F84\u3002",
  error_INVALID_SKILL: "\u6280\u80FD\u683C\u5F0F\u6709\u8BEF\uFF0C\u8BF7\u68C0\u67E5\u8BCA\u65AD\u7ED3\u679C\u3002",
  error_PREVIEW_EXPIRED: "\u9884\u89C8\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u9884\u89C8\u6765\u6E90\u3002",
  error_LIMIT: "\u5BFC\u5165\u8D85\u51FA\u4E86\u652F\u6301\u7684\u6587\u4EF6\u6570\u91CF\u6216\u5927\u5C0F\u9650\u5236\u3002",
  update: "\u68C0\u67E5\u6765\u6E90\u66F4\u65B0",
  updateTitle: "\u68C0\u67E5\u6280\u80FD\u66F4\u65B0",
  updateHint: "\u5BF9\u7167\u672C\u5730\u5185\u5BB9\u548C\u62C9\u53D6\u5230\u7684\u63D0\u4EA4\u7248\u672C\uFF0C\u786E\u8BA4\u540E\u518D\u66FF\u6362\u6587\u4EF6\u3002",
  updateApply: "\u5E94\u7528\u5DF2\u68C0\u67E5\u7684\u66F4\u65B0",
  updated: "\u6280\u80FD\u5DF2\u66F4\u65B0",
  previousCommit: "\u5DF2\u5B89\u88C5\u63D0\u4EA4",
  incomingCommit: "\u65B0\u63D0\u4EA4",
  currentVersion: "\u5F53\u524D\u672C\u5730\u6307\u4EE4",
  incomingVersion: "\u5F85\u66F4\u65B0\u6307\u4EE4",
  localModified: "\u68C0\u6D4B\u5230\u672C\u5730\u4FEE\u6539\u3002\u5E94\u7528\u66F4\u65B0\u4F1A\u66FF\u6362\u8FD9\u4E9B\u5185\u5BB9\uFF0C\u66F4\u65B0\u524D\u5C06\u4FDD\u7559\u6062\u590D\u5FEB\u7167\u3002",
  unchanged: "\u6765\u6E90\u63D0\u4EA4\u6CA1\u6709\u53D8\u5316\u3002",
  change_added: "\u65B0\u589E",
  change_removed: "\u5220\u9664",
  change_changed: "\u4FEE\u6539",
  change_unchanged: "\u672A\u53D8",
  copySkill: "\u590D\u5236\u5230\u5176\u4ED6\u4F4D\u7F6E",
  copyTitle: "\u590D\u5236\u5B8C\u6574\u6280\u80FD",
  copyHint: "\u4FDD\u7559\u539F\u6280\u80FD\uFF0C\u5C06\u6307\u4EE4\u548C\u8D44\u6E90\u590D\u5236\u5230\u53E6\u4E00\u4E2A\u6280\u80FD\u4F4D\u7F6E\u3002",
  skillCopied: "\u6280\u80FD\u5DF2\u590D\u5236",
  providerHint: "\u8FD9\u4E2A\u6280\u80FD\u7531\u5176\u4ED6\u63D2\u4EF6\u63D0\u4F9B\uFF0C\u8BF7\u901A\u8FC7\u6765\u6E90\u63D2\u4EF6\u7BA1\u7406\u539F\u59CB\u8D44\u6E90\u3002",
  saveResource: "\u4FDD\u5B58\u8D44\u6E90",
  resourceSaved: "\u8D44\u6E90\u6587\u4EF6\u5DF2\u4FDD\u5B58",
  resourceUnsaved: "\u653E\u5F03\u5C1A\u672A\u4FDD\u5B58\u7684\u8D44\u6E90\u4FEE\u6539\uFF1F",
  resourceLabel: "\u8D44\u6E90\u6587\u672C\u7F16\u8F91\u5668",
  error_STALE_WRITE: "\u6280\u80FD\u5DF2\u88AB\u5176\u4ED6\u64CD\u4F5C\u4FEE\u6539\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u540E\u518D\u4FDD\u5B58\u3002",
  error_UNSAFE_PATH: "\u64CD\u4F5C\u5305\u542B\u4E0D\u5B89\u5168\u7684\u8DEF\u5F84\u3002",
  error_SYMLINK: "\u6682\u4E0D\u7BA1\u7406\u7B26\u53F7\u94FE\u63A5\u6587\u4EF6\u3002",
  error_TOO_LARGE: "\u6587\u4EF6\u6216\u538B\u7F29\u5305\u8D85\u8FC7\u5927\u5C0F\u9650\u5236\u3002",
  error_TOO_MANY_FILES: "\u6280\u80FD\u4E2D\u7684\u6587\u4EF6\u6570\u91CF\u8D85\u8FC7\u9650\u5236\u3002",
  error_NO_SKILLS: "\u672A\u627E\u5230\u6709\u6548\u7684\u6280\u80FD\u6307\u4EE4\u6587\u4EF6\u3002",
  error_ROOT_NOT_FOUND: "\u6240\u9009\u6280\u80FD\u4F4D\u7F6E\u5DF2\u4E0D\u53EF\u7528\u3002",
  error_INVALID_NAME: "\u540D\u79F0\u8BF7\u4F7F\u7528\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u5355\u4E2A\u8FDE\u5B57\u7B26\u3002",
  error_NAME_MISMATCH: "\u66F4\u65B0\u5FC5\u987B\u4FDD\u6301\u539F\u6709\u6280\u80FD\u540D\u79F0\u3002",
  error_NOT_BUNDLE: "\u8BF7\u5148\u628A\u8FD9\u4E2A\u5E73\u94FA\u6280\u80FD\u590D\u5236\u4E3A\u76EE\u5F55\u6280\u80FD\uFF0C\u518D\u66F4\u65B0\u5176\u8D44\u6E90\u3002",
  diagnostic_MISSING_FRONTMATTER: "\u8BF7\u6DFB\u52A0\u5305\u542B name \u548C description \u7684 YAML \u5934\u90E8\u3002",
  diagnostic_INVALID_YAML: "YAML \u5934\u90E8\u683C\u5F0F\u6709\u8BEF\uFF0C\u65E0\u6CD5\u89E3\u6790\u3002",
  diagnostic_INVALID_NAME: "\u6280\u80FD\u540D\u8BF7\u4F7F\u7528\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u8FDE\u5B57\u7B26\uFF0C\u4F8B\u5982 research-notes\u3002",
  diagnostic_MISSING_DESCRIPTION: "\u8BF7\u8865\u5145\u975E\u7A7A\u7684\u6280\u80FD\u7528\u9014\u4E0E\u9002\u7528\u573A\u666F\u63CF\u8FF0\u3002",
  diagnostic_LONG_DESCRIPTION: "\u5EFA\u8BAE\u5C06\u63CF\u8FF0\u63A7\u5236\u5728 1024 \u4E2A\u5B57\u7B26\u4EE5\u5185\u3002",
  diagnostic_LEGACY_INVOCATION: "\u8C03\u7528\u7B56\u7565\u8BF7\u4F7F\u7528 disable-model-invocation \u548C user-invocable \u5B57\u6BB5\u3002",
  diagnostic_INVALID_INVOCATION: "\u8C03\u7528\u7B56\u7565\u5FC5\u987B\u4F7F\u7528 true \u6216 false \u5E03\u5C14\u503C\u3002",
  diagnostic_EMPTY_BODY: "\u8BF7\u5728 YAML \u5934\u90E8\u4E4B\u540E\u6DFB\u52A0\u6280\u80FD\u6307\u4EE4\u6B63\u6587\u3002",
  diagnostic_LONG_BODY: "\u6B63\u6587\u8F83\u957F\uFF0C\u5EFA\u8BAE\u5C06\u53C2\u8003\u8D44\u6599\u62C6\u5230 references/ \u76EE\u5F55\u3002",
  diagnostic_DUPLICATE_INSTRUCTION: "\u542F\u7528\u548C\u505C\u7528\u7684\u6307\u4EE4\u6587\u4EF6\u540C\u65F6\u5B58\u5728\uFF0C\u8BF7\u5148\u5904\u7406\u91CD\u590D\u6587\u4EF6\u3002",
  diagnostic_TOO_LARGE: "\u6280\u80FD\u6307\u4EE4\u6587\u4EF6\u8D85\u8FC7\u652F\u6301\u7684\u5927\u5C0F\u9650\u5236\u3002",
  diagnostic_SYMLINK: "\u6280\u80FD\u4E2D\u5305\u542B\u6682\u4E0D\u652F\u6301\u7684\u7B26\u53F7\u94FE\u63A5\u3002",
  diagnostic_READ_FAILED: "\u90E8\u5206\u6280\u80FD\u6587\u4EF6\u672A\u80FD\u8BFB\u53D6\u3002",
  templateGeneralDescription: "\u8F93\u5165\u3001\u6B65\u9AA4\u548C\u68C0\u67E5\u6807\u51C6\u6E05\u6670\u7684\u53EF\u590D\u7528\u5DE5\u4F5C\u6D41\u3002",
  templateGeneralBody: "# \u5DE5\u4F5C\u6D41\u7A0B\n\n## \u8F93\u5165\n\u8BF4\u660E\u5F00\u59CB\u524D\u9700\u8981\u54EA\u4E9B\u4FE1\u606F\u3002\n\n## \u6B65\u9AA4\n1. \u68C0\u67E5\u7528\u6237\u9700\u6C42\u548C\u73B0\u6709\u4E0A\u4E0B\u6587\u3002\n2. \u9009\u62E9\u5408\u9002\u7684\u5DE5\u5177\u5B8C\u6210\u5DE5\u4F5C\u3002\n3. \u5BF9\u7167\u8981\u6C42\u68C0\u67E5\u7ED3\u679C\u3002\n\n## \u4EA4\u4ED8\n\u5148\u7ED9\u51FA\u660E\u786E\u7ED3\u679C\uFF0C\u518D\u63D0\u4F9B\u76F8\u5173\u8BC1\u636E\u3002\n",
  templateResearchBody: "# \u8D44\u6599\u7814\u7A76\u6D41\u7A0B\n\n## \u6536\u96C6\u8BC1\u636E\n\u4F18\u5148\u4F7F\u7528\u4E00\u624B\u6765\u6E90\uFF0C\u8BB0\u5F55\u53D1\u5E03\u65E5\u671F\u548C\u539F\u59CB\u94FE\u63A5\u3002\n\n## \u5206\u6790\n\u533A\u5206\u5DF2\u786E\u8BA4\u7684\u4E8B\u5B9E\u548C\u63A8\u65AD\u3002\u9047\u5230\u76F8\u4E92\u51B2\u7A81\u7684\u8BC1\u636E\uFF0C\u8BF4\u660E\u5DEE\u5F02\u4E0E\u4E0D\u786E\u5B9A\u6027\u3002\n\n## \u4EA4\u4ED8\n\u5148\u56DE\u7B54\u95EE\u9898\uFF0C\u518D\u7ED9\u51FA\u8BC1\u636E\u548C\u6765\u6E90\u3002\n",
  templateWritingBody: "# \u5185\u5BB9\u5199\u4F5C\u6D41\u7A0B\n\n## \u7406\u89E3\u9700\u6C42\n\u660E\u786E\u53D7\u4F17\u3001\u5E73\u53F0\u3001\u76EE\u7684\u548C\u9650\u5236\u3002\n\n## \u8D77\u8349\n\u4ECE\u4E00\u4E2A\u5177\u4F53\u89C2\u70B9\u5207\u5165\uFF0C\u4F7F\u7528\u8FDE\u8D2F\u6BB5\u843D\uFF0C\u5E76\u6838\u67E5\u4E8B\u5B9E\u3002\n\n## \u5BA1\u7A3F\n\u5220\u9664\u7A7A\u6CDB\u8868\u8FBE\u3001\u65E0\u8BC1\u636E\u7684\u7ED3\u8BBA\u548C\u91CD\u590D\u5185\u5BB9\uFF0C\u68C0\u67E5\u5B57\u6570\u4E0E\u683C\u5F0F\u3002\n",
  templateCodeBody: "# \u4EE3\u7801\u5BA1\u67E5\u6D41\u7A0B\n\n## \u9605\u8BFB\n\u4FEE\u6539\u524D\u5148\u9605\u8BFB\u76F8\u5173\u4EE3\u7801\u548C\u4ED3\u5E93\u7EA6\u5B9A\u3002\n\n## \u5BA1\u67E5\n\u8FFD\u8E2A\u5B9E\u9645\u884C\u4E3A\uFF0C\u627E\u51FA\u5177\u4F53\u5931\u8D25\u573A\u666F\uFF0C\u68C0\u67E5\u517C\u5BB9\u6027\u4E0E\u9519\u8BEF\u5904\u7406\u3002\n\n## \u9A8C\u8BC1\n\u8FD0\u884C\u6709\u610F\u4E49\u7684\u68C0\u67E5\uFF0C\u8BF4\u660E\u95EE\u9898\u6240\u5728\u6587\u4EF6\u53CA\u5B9E\u9645\u5F71\u54CD\u3002\n"
};
Object.assign(zh, { catalogIncomplete: "\u90E8\u5206\u6280\u80FD\u4F4D\u7F6E\u672A\u80FD\u5B8C\u6574\u8BFB\u53D6\uFF0C\u5F53\u524D\u5217\u8868\u53EF\u80FD\u4E0D\u5B8C\u6574\u3002", addResource: "\u65B0\u589E\u6587\u672C\u8D44\u6E90", resourcePath: "\u8D44\u6E90\u8DEF\u5F84", resourcePathHint: "\u4F8B\u5982 references/checklist.md \u6216 scripts/helper.py", removeResource: "\u79FB\u9664\u8D44\u6E90", removeResourceConfirm: "\u79FB\u9664\u8FD9\u4E2A\u8D44\u6E90\u6587\u4EF6\uFF1F\u64CD\u4F5C\u524D\u4F1A\u5907\u4EFD\u5B8C\u6574\u6280\u80FD\u3002", resourceRemoved: "\u8D44\u6E90\u6587\u4EF6\u5DF2\u79FB\u9664", reviewFiles: "\u8D44\u6E90\u53D8\u66F4", updateOverview: "\u8BF7\u540C\u65F6\u68C0\u67E5\u6307\u4EE4\u6B63\u6587\u548C\u8D44\u6E90\u6587\u4EF6\u7684\u53D8\u5316\u3002", noChanges: "\u6CA1\u6709\u6587\u4EF6\u53D8\u5316\u3002", invalidResource: "\u8BF7\u586B\u5199\u76F8\u5BF9\u6587\u4EF6\u8DEF\u5F84\u3002" });
Object.assign(en, {
  brand: "IT\u5496\u5561\u9986 X \u8001\u9648\u804AAI",
  overview: "Overview",
  backToList: "Back to list",
  closeDetail: "Close details",
  targetWorkspace: "Workspace",
  targetPreset: "Agent preset",
  targetContext: "Target context",
  followSession: "Follow current session",
  brokenPreset: "Unavailable",
  contextHint: "This selects the workspace and agent preset used for inspection and file management. It does not change the current conversation\u2019s agent preset.",
  scope_global: "Global",
  scope_workspace: "Current workspace",
  scope_provided: "Provided by plugins",
  scope_custom: "Custom sources",
  sources: "Sources",
  advancedPath: "Paths and technical details",
  sourceOrderHint: "When names overlap, skills in the current project take precedence. Inspect the detail view to see which source is effective.",
  skillsList: "Skills list",
  layout: "Layout",
  listView: "List view",
  cardView: "Card view",
  shadowedShort: "Other source active",
  allowModel: "Allow automatic model selection",
  allowUser: "Allow /manual invocation",
  allowModelHint: "The model can choose this skill when relevant.",
  savePolicy: "Save invocation settings",
  policyUnsaved: "Invocation settings not saved",
  policyOnFile: "Invocation settings on disk",
  policySaved: "Invocation settings saved",
  policySyncHint: "Each switch is independent. Saving updates the instruction file, then checks the runtime catalog and refreshes the slash menu when supported.",
  stateOverview: "Status",
  diskState: "Files on disk",
  runtimeState: "Current target",
  historyState: "Conversation history",
  fileEnabled: "File enabled",
  fileDisabled: "File disabled",
  stateSaved: "File status saved",
  stateLayersHint: "File status, discoverability in the selected preset, and instructions already loaded into conversation history are separate states.",
  duplicateHint: "Disabling one copy may reveal a lower priority copy with the same name. Check the effective source in the runtime status.",
  runtimeStateHint: "Availability is verified against the selected workspace and agent preset. Enabled files can still be outside the preset, invalid, or shadowed by another source.",
  loadedHistorySeparate: "Existing content retained",
  historyContextHint: "Changes affect later discovery and invocation. Instructions already loaded into a conversation remain in its history.",
  runtimeOff: "Excluded from discovery",
  runtimeInvalid: "Invalid skill format",
  runtimeShadowed: "Another source takes precedence",
  runtimeUnknown: "Not verified",
  runtimeAvailable: "Discovered in target",
  runtimeUnavailable: "Not available in target",
  availability_available: "Discovered in target",
  availability_disabled: "Excluded from discovery",
  availability_shadowed: "Another source takes precedence",
  availability_not_in_preset: "Not in selected preset",
  availability_invalid: "Invalid skill format",
  availability_unknown: "Not verified",
  modelShort: "Model",
  userShort: "/Manual",
  instructionPreview: "Instructions",
  editInstructions: "Edit instructions",
  editingHint: "Edit the complete SKILL.md, including its YAML header. Save invocation switches separately in Overview before editing the text.",
  discardEdits: "Discard edits",
  readMode: "No unsaved changes",
  syncVerified: "Catalog verified \xB7 /menu refreshed",
  syncCatalog: "Catalog verified",
  syncPending: "Runtime synchronization pending",
  syncUnknown: "Runtime status not verified",
  syncMenuFailed: "/menu refresh failed; refresh the conversation",
  syncMenuUnsupported: "/menu refresh is not supported by this host",
  uploadResource: "Upload resource",
  replaceResourceConfirm: "Replace the resource at this path? The full skill is backed up first.",
  error_POLICY_ALIAS: "This setting shares a YAML alias with other metadata. Edit the instruction file explicitly to avoid changing both.",
  enabledHint: "Instruction file is enabled on disk",
  disabledHint: "Instruction file is disabled on disk",
  rootHint: "When names overlap, skills in the current project take precedence. Inspect details to see the effective source.",
  policyHint: "Choose whether the model can select this skill and whether users can call it through /name. These settings are independent of whether its file is enabled."
});
Object.assign(zh, {
  brand: "IT\u5496\u5561\u9986 X \u8001\u9648\u804AAI",
  overview: "\u6982\u89C8",
  backToList: "\u8FD4\u56DE\u5217\u8868",
  closeDetail: "\u5173\u95ED\u8BE6\u60C5",
  targetWorkspace: "\u76EE\u6807\u5DE5\u4F5C\u533A",
  targetPreset: "Agent \u9884\u8BBE",
  targetContext: "\u76EE\u6807\u4E0A\u4E0B\u6587\u8BF4\u660E",
  followSession: "\u8DDF\u968F\u5F53\u524D\u4F1A\u8BDD",
  brokenPreset: "\u4E0D\u53EF\u7528",
  contextHint: "\u8FD9\u91CC\u9009\u62E9\u68C0\u67E5\u548C\u7BA1\u7406\u6280\u80FD\u65F6\u4F7F\u7528\u7684\u5DE5\u4F5C\u533A\u4E0E Agent \u9884\u8BBE\uFF0C\u4E0D\u4F1A\u5207\u6362\u5F53\u524D\u4F1A\u8BDD\u6B63\u5728\u4F7F\u7528\u7684\u9884\u8BBE\u3002",
  scope_global: "\u5168\u5C40",
  scope_workspace: "\u5F53\u524D\u5DE5\u4F5C\u533A",
  scope_provided: "\u968F\u63D2\u4EF6\u63D0\u4F9B",
  scope_custom: "\u81EA\u5B9A\u4E49\u6765\u6E90",
  sources: "\u6280\u80FD\u6765\u6E90",
  advancedPath: "\u8DEF\u5F84\u4E0E\u9AD8\u7EA7\u4FE1\u606F",
  sourceOrderHint: "\u540C\u540D\u65F6\u4F18\u5148\u4F7F\u7528\u5F53\u524D\u9879\u76EE\u4E2D\u7684\u6280\u80FD\uFF1B\u5177\u4F53\u751F\u6548\u6765\u6E90\u53EF\u5728\u8BE6\u60C5\u67E5\u770B\u3002",
  skillsList: "\u6280\u80FD\u5217\u8868",
  layout: "\u89C6\u56FE\u5E03\u5C40",
  listView: "\u5217\u8868\u89C6\u56FE",
  cardView: "\u5361\u7247\u89C6\u56FE",
  shadowedShort: "\u4F7F\u7528\u5176\u4ED6\u6765\u6E90",
  allowModel: "\u5141\u8BB8\u6A21\u578B\u81EA\u52A8\u9009\u7528",
  allowUser: "\u5141\u8BB8 /\u624B\u52A8\u8C03\u7528",
  allowModelHint: "\u6A21\u578B\u53EF\u5728\u9002\u7528\u65F6\u4E3B\u52A8\u9009\u62E9\u8FD9\u4E2A\u6280\u80FD\u3002",
  savePolicy: "\u4FDD\u5B58\u8C03\u7528\u8BBE\u7F6E",
  policyUnsaved: "\u8C03\u7528\u8BBE\u7F6E\u5C1A\u672A\u4FDD\u5B58",
  policyOnFile: "\u6587\u4EF6\u4E2D\u7684\u8C03\u7528\u8BBE\u7F6E",
  policySaved: "\u8C03\u7528\u8BBE\u7F6E\u5DF2\u4FDD\u5B58",
  policySyncHint: "\u4E24\u4E2A\u5F00\u5173\u4E92\u76F8\u72EC\u7ACB\u3002\u4FDD\u5B58\u540E\u66F4\u65B0\u6307\u4EE4\u6587\u4EF6\uFF0C\u518D\u6838\u9A8C\u8FD0\u884C\u76EE\u5F55\uFF1B\u5BBF\u4E3B\u652F\u6301\u65F6\u4F1A\u540C\u6B65\u5237\u65B0 / \u83DC\u5355\u3002",
  stateOverview: "\u72B6\u6001\u6982\u89C8",
  diskState: "\u6587\u4EF6\u72B6\u6001",
  runtimeState: "\u5F53\u524D\u76EE\u6807\u53EF\u7528\u6027",
  historyState: "\u5DF2\u6709\u4F1A\u8BDD\u5386\u53F2",
  fileEnabled: "\u6587\u4EF6\u5DF2\u542F\u7528",
  fileDisabled: "\u6587\u4EF6\u5DF2\u505C\u7528",
  stateSaved: "\u6587\u4EF6\u72B6\u6001\u5DF2\u4FDD\u5B58",
  stateLayersHint: "\u6587\u4EF6\u662F\u5426\u542F\u7528\u3001\u6240\u9009\u9884\u8BBE\u80FD\u5426\u53D1\u73B0\uFF0C\u4EE5\u53CA\u4F1A\u8BDD\u91CC\u5DF2\u7ECF\u52A0\u8F7D\u8FC7\u7684\u5185\u5BB9\uFF0C\u662F\u4E09\u79CD\u4E0D\u540C\u7684\u72B6\u6001\u3002",
  duplicateHint: "\u505C\u7528\u67D0\u4E2A\u526F\u672C\u540E\uFF0C\u53E6\u4E00\u4E2A\u540C\u540D\u526F\u672C\u53EF\u80FD\u63A5\u66FF\u5B83\uFF1B\u8BF7\u540C\u65F6\u68C0\u67E5\u5F53\u524D\u5B9E\u9645\u91C7\u7528\u7684\u6765\u6E90\u3002",
  runtimeStateHint: "\u4EE5\u6240\u9009\u5DE5\u4F5C\u533A\u4E0E Agent \u9884\u8BBE\u7684\u5B9E\u9645\u6CE8\u518C\u7ED3\u679C\u4E3A\u51C6\u3002\u6587\u4EF6\u5DF2\u542F\u7528\uFF0C\u4E5F\u53EF\u80FD\u672A\u8FDB\u5165\u8BE5\u9884\u8BBE\u3001\u683C\u5F0F\u65E0\u6548\uFF0C\u6216\u88AB\u5176\u4ED6\u6765\u6E90\u7684\u540C\u540D\u6280\u80FD\u66FF\u4EE3\u3002",
  loadedHistorySeparate: "\u5DF2\u52A0\u8F7D\u5185\u5BB9\u4ECD\u4FDD\u7559",
  historyContextHint: "\u4FEE\u6539\u5F71\u54CD\u540E\u7EED\u53D1\u73B0\u4E0E\u8C03\u7528\uFF1B\u4F1A\u8BDD\u4E4B\u524D\u52A0\u8F7D\u7684\u6280\u80FD\u6307\u4EE4\u4ECD\u4FDD\u7559\u5728\u5386\u53F2\u4E0A\u4E0B\u6587\u4E2D\u3002",
  runtimeOff: "\u4E0D\u53C2\u4E0E\u6280\u80FD\u53D1\u73B0",
  runtimeInvalid: "\u683C\u5F0F\u65E0\u6548\uFF0C\u65E0\u6CD5\u4F7F\u7528",
  runtimeShadowed: "\u5B9E\u9645\u4F7F\u7528\u5176\u4ED6\u6765\u6E90",
  runtimeUnknown: "\u8FD0\u884C\u72B6\u6001\u5C1A\u672A\u6838\u9A8C",
  runtimeAvailable: "\u5F53\u524D\u76EE\u6807\u5DF2\u53D1\u73B0",
  runtimeUnavailable: "\u5F53\u524D\u76EE\u6807\u4E0D\u53EF\u7528",
  availability_available: "\u5F53\u524D\u76EE\u6807\u5DF2\u53D1\u73B0",
  availability_disabled: "\u4E0D\u53C2\u4E0E\u6280\u80FD\u53D1\u73B0",
  availability_shadowed: "\u5B9E\u9645\u4F7F\u7528\u5176\u4ED6\u6765\u6E90",
  availability_not_in_preset: "\u672A\u8FDB\u5165\u6240\u9009\u9884\u8BBE",
  availability_invalid: "\u683C\u5F0F\u65E0\u6548\uFF0C\u65E0\u6CD5\u4F7F\u7528",
  availability_unknown: "\u8FD0\u884C\u72B6\u6001\u5C1A\u672A\u6838\u9A8C",
  modelShort: "\u6A21\u578B",
  userShort: "/\u624B\u52A8",
  instructionPreview: "\u6307\u4EE4\u9884\u89C8",
  editInstructions: "\u7F16\u8F91\u6307\u4EE4",
  editingHint: "\u8FD9\u91CC\u7F16\u8F91\u5305\u542B YAML \u5934\u90E8\u7684\u5B8C\u6574 SKILL.md\u3002\u6982\u89C8\u4E2D\u7684\u8C03\u7528\u5F00\u5173\u9700\u5355\u72EC\u4FDD\u5B58\uFF0C\u518D\u8FDB\u884C\u6B63\u6587\u7F16\u8F91\u3002",
  discardEdits: "\u653E\u5F03\u4FEE\u6539",
  readMode: "\u5F53\u524D\u6CA1\u6709\u672A\u4FDD\u5B58\u4FEE\u6539",
  syncVerified: "\u6280\u80FD\u76EE\u5F55\u5DF2\u6838\u9A8C \xB7 /\u83DC\u5355\u5DF2\u5237\u65B0",
  syncCatalog: "\u6280\u80FD\u76EE\u5F55\u5DF2\u6838\u9A8C",
  syncPending: "\u8FD0\u884C\u72B6\u6001\u540C\u6B65\u4E2D",
  syncUnknown: "\u8FD0\u884C\u72B6\u6001\u5C1A\u672A\u6838\u9A8C",
  syncMenuFailed: "/\u83DC\u5355\u5237\u65B0\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u4F1A\u8BDD",
  syncMenuUnsupported: "\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u5237\u65B0 /\u83DC\u5355",
  uploadResource: "\u4E0A\u4F20\u8D44\u6E90",
  replaceResourceConfirm: "\u66FF\u6362\u8FD9\u4E2A\u8DEF\u5F84\u7684\u8D44\u6E90\u6587\u4EF6\uFF1F\u64CD\u4F5C\u524D\u4F1A\u5907\u4EFD\u5B8C\u6574\u6280\u80FD\u3002",
  error_POLICY_ALIAS: "\u8FD9\u4E2A\u8BBE\u7F6E\u4E0E\u5176\u4ED6\u5143\u6570\u636E\u5171\u7528\u4E86 YAML \u522B\u540D\uFF0C\u8BF7\u5728\u6307\u4EE4\u7F16\u8F91\u5668\u4E2D\u660E\u786E\u4FEE\u6539\uFF0C\u907F\u514D\u8FDE\u5E26\u53D8\u66F4\u3002",
  enabledHint: "\u78C1\u76D8\u4E2D\u7684\u6307\u4EE4\u6587\u4EF6\u5DF2\u542F\u7528",
  disabledHint: "\u78C1\u76D8\u4E2D\u7684\u6307\u4EE4\u6587\u4EF6\u5DF2\u505C\u7528",
  rootHint: "\u540C\u540D\u65F6\u4F18\u5148\u4F7F\u7528\u5F53\u524D\u9879\u76EE\u4E2D\u7684\u6280\u80FD\uFF1B\u5177\u4F53\u751F\u6548\u6765\u6E90\u53EF\u5728\u8BE6\u60C5\u67E5\u770B\u3002",
  policyHint: "\u5206\u522B\u63A7\u5236\u6A21\u578B\u80FD\u5426\u81EA\u52A8\u9009\u7528\uFF0C\u4EE5\u53CA\u7528\u6237\u80FD\u5426\u901A\u8FC7 /\u540D\u79F0 \u8C03\u7528\u3002\u8FD9\u4E24\u4E2A\u8BBE\u7F6E\u4E0E\u6587\u4EF6\u542F\u505C\u4E92\u76F8\u72EC\u7ACB\u3002"
});
Object.assign(en, { globalOnly: "Global skills only", effectiveSource: "Effective source" });
Object.assign(zh, { globalOnly: "\u4EC5\u5168\u5C40\u6280\u80FD", effectiveSource: "\u5B9E\u9645\u751F\u6548\u6765\u6E90" });
Object.assign(en, { externalChange: "Files changed outside this editor.", reloadSkill: "Reload files", reloaded: "Files reloaded" });
Object.assign(zh, { externalChange: "\u6587\u4EF6\u5DF2\u88AB\u5176\u4ED6\u64CD\u4F5C\u4FEE\u6539\u3002", reloadSkill: "\u91CD\u65B0\u8BFB\u53D6\u6587\u4EF6", reloaded: "\u5DF2\u91CD\u65B0\u8BFB\u53D6\u6587\u4EF6" });
Object.assign(en, { shadowedHint: "The selected target uses another source with the same skill name.", duplicateHint: "Disabling one copy may reveal another copy with the same name. Check the effective source in the runtime status." });
Object.assign(zh, { shadowedHint: "\u5F53\u524D\u76EE\u6807\u5B9E\u9645\u4F7F\u7528\u4E86\u53E6\u4E00\u4E2A\u540C\u540D\u6765\u6E90\u3002" });
Object.assign(en, { loadedHistorySeparate: "History is unaffected by these settings" });
Object.assign(zh, { loadedHistorySeparate: "\u5386\u53F2\u5185\u5BB9\u4E0D\u53D7\u6B64\u8BBE\u7F6E\u5F71\u54CD" });
Object.assign(en, { policyHint: "Automatic selection lets the model decide when to use the skill. /Manual invocation adds it to the input\u2019s skill menu. Set each independently, then save to sync the skill catalog." });
Object.assign(zh, { policyHint: "\u81EA\u52A8\u9009\u7528\u7531\u6A21\u578B\u5224\u65AD\u4F55\u65F6\u4F7F\u7528\uFF1B/\u624B\u52A8\u8C03\u7528\u4F1A\u51FA\u73B0\u5728\u8F93\u5165\u6846\u7684\u6280\u80FD\u83DC\u5355\u4E2D\u3002\u4E24\u8005\u53EF\u5206\u522B\u8BBE\u7F6E\uFF0C\u4FDD\u5B58\u540E\u540C\u6B65\u6280\u80FD\u76EE\u5F55\u3002" });
Object.assign(en, {
  targetWorkspace: "Workspace",
  targetPreset: "Mode",
  targetContext: "About workspaces and modes",
  followSession: "Current session",
  modeStandard: "Standard mode",
  modePtc: "PTC mode",
  modeMinimal: "Minimal mode",
  modeCordis: "Creator mode",
  unknownMode: "Unknown mode",
  contextHint: "Choose a workspace and mode to view its skills. This does not change the current session.",
  currentSuffix: " (current)",
  defaultSuffix: " (default)",
  scope_global: "Personal skills",
  scope_workspace: "Workspace skills",
  scope_provided: "Plugin skills",
  scope_custom: "Other locations",
  personalSkills: "Personal skills",
  sharedSkills: "Shared skills",
  dshSkills: "DSH skills",
  workspaceSkills: "Workspace skills",
  personalHint: "These skills are available across workspaces. Shared skills may also be used by other apps.",
  workspaceHint: "These skills belong to this workspace.",
  sources: "Skill locations",
  advancedPath: "Save location",
  globalOnly: "Personal skills only",
  location: "Import to",
  locationPersonal: "All workspaces \xB7 Personal skills",
  locationShared: "All workspaces \xB7 Shared skills",
  locationWorkspace: "This workspace only",
  sourceOrderHint: "If several copies have the same name, the details show which one DSH uses.",
  saved: "Saved",
  policySaved: "Saved",
  stateSaved: "Saved",
  enabledSuccess: "Enabled",
  disabledSuccess: "Disabled",
  fileEnabled: "Enabled",
  fileDisabled: "Disabled",
  diskState: "Skill status",
  runtimeState: "Selected mode",
  stateLayersHint: "An enabled skill may still be unavailable in the selected mode. The status below checks that mode.",
  runtimeStateHint: "Some modes do not include local skills. This skill can stay enabled; choose another mode to check its availability.",
  runtimeAvailable: "Available",
  runtimeUnavailable: "Unavailable in this mode",
  runtimeOff: "Disabled",
  runtimeUnknown: "Not confirmed",
  availability_available: "Available",
  availability_disabled: "Disabled",
  availability_shadowed: "Using another copy",
  availability_not_in_preset: "Unavailable in this mode",
  availability_unknown: "Not confirmed",
  importTitle: "Import skills",
  importHint: "Add skills from GitHub or local files.",
  preview: "Next",
  importNow: "Import",
  previewTitle: "Skills to import",
  ready: "Ready to import",
  conflict: "Already in this location",
  conflictHint: "A skill with this name already exists here. Its current files will be kept.",
  githubUrl: "GitHub skill URL",
  previewCommitHint: "The selected version is used for this import.",
  savePolicy: "Save settings",
  policyOnFile: "Settings saved",
  policyUnsaved: "Unsaved settings",
  historyContextHint: "Changes apply to later use. Content already loaded into a conversation stays in its history.",
  syncDetails: "Update status",
  refreshAfterSaveFailed: "Saved, but the list could not refresh. Your files are safe; refresh the list to see the latest state.",
  errorDetails: "Error details",
  copyError: "Copy error",
  copyFallback: "Select and copy the details below.",
  errorRetry: "Retry save",
  error_FILE_BUSY: "The file is in use by another program. Your changes are still here. Wait a moment, then retry.",
  error_FILE_ACCESS: "The file could not be written. Check whether it is in use or whether you have write permission. Your changes are still here.",
  error_EBUSY: "The file is in use by another program. Your changes are still here. Wait a moment, then retry.",
  error_EPERM: "The file could not be written. Check whether it is in use or whether you have write permission.",
  error_EACCES: "The file could not be written. Check whether it is in use or whether you have write permission.",
  error_RECOVERY_REQUIRED: "The operation could not finish. Your original files were kept. See Error details for their recovery location.",
  error_ENOSPC: "There is not enough disk space to save. Your changes are still here. Free some space, then retry.",
  savedPartial: "Some skills were imported. The items below could not be imported.",
  cleanupPending: "Saved. Some temporary files will be cleaned up later.",
  saveTo: "Save to"
});
Object.assign(zh, {
  targetWorkspace: "\u5DE5\u4F5C\u533A",
  targetPreset: "\u6A21\u5F0F",
  targetContext: "\u5DE5\u4F5C\u533A\u4E0E\u6A21\u5F0F\u8BF4\u660E",
  followSession: "\u5F53\u524D\u4F1A\u8BDD",
  modeStandard: "\u6807\u51C6\u6A21\u5F0F",
  modePtc: "PTC \u6A21\u5F0F",
  modeMinimal: "\u6781\u7B80\u6A21\u5F0F",
  modeCordis: "\u521B\u9020\u6A21\u5F0F",
  unknownMode: "\u672A\u77E5\u6A21\u5F0F",
  contextHint: "\u9009\u62E9\u5DE5\u4F5C\u533A\u548C\u6A21\u5F0F\uFF0C\u67E5\u770B\u5BF9\u5E94\u6280\u80FD\u3002\u8FD9\u91CC\u4E0D\u4F1A\u6539\u53D8\u5F53\u524D\u4F1A\u8BDD\u3002",
  currentSuffix: "\uFF08\u5F53\u524D\uFF09",
  defaultSuffix: "\uFF08\u9ED8\u8BA4\uFF09",
  scope_global: "\u4E2A\u4EBA\u6280\u80FD",
  scope_workspace: "\u5DE5\u4F5C\u533A\u6280\u80FD",
  scope_provided: "\u63D2\u4EF6\u81EA\u5E26",
  scope_custom: "\u5176\u4ED6\u4F4D\u7F6E",
  personalSkills: "\u4E2A\u4EBA\u6280\u80FD",
  sharedSkills: "\u5171\u4EAB\u6280\u80FD",
  dshSkills: "DSH \u6280\u80FD",
  workspaceSkills: "\u5DE5\u4F5C\u533A\u6280\u80FD",
  personalHint: "\u4E2A\u4EBA\u6280\u80FD\u53EF\u5728\u5404\u4E2A\u5DE5\u4F5C\u533A\u4F7F\u7528\u3002\u5171\u4EAB\u6280\u80FD\u4E5F\u53EF\u80FD\u88AB\u5176\u4ED6\u5E94\u7528\u4F7F\u7528\u3002",
  workspaceHint: "\u8FD9\u4E9B\u6280\u80FD\u53EA\u5728\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u4F7F\u7528\u3002",
  sources: "\u6280\u80FD\u4F4D\u7F6E",
  advancedPath: "\u4FDD\u5B58\u4F4D\u7F6E",
  globalOnly: "\u4EC5\u4E2A\u4EBA\u6280\u80FD",
  location: "\u5BFC\u5165\u5230",
  locationPersonal: "\u6240\u6709\u5DE5\u4F5C\u533A \xB7 \u4E2A\u4EBA\u6280\u80FD",
  locationShared: "\u6240\u6709\u5DE5\u4F5C\u533A \xB7 \u5171\u4EAB\u6280\u80FD",
  locationWorkspace: "\u4EC5\u6B64\u5DE5\u4F5C\u533A",
  sourceOrderHint: "\u540C\u540D\u6280\u80FD\u53EF\u80FD\u6709\u591A\u4EFD\uFF0C\u8BE6\u60C5\u4F1A\u663E\u793A DSH \u5B9E\u9645\u4F7F\u7528\u54EA\u4E00\u4EFD\u3002",
  saved: "\u5DF2\u4FDD\u5B58",
  policySaved: "\u5DF2\u4FDD\u5B58",
  stateSaved: "\u5DF2\u4FDD\u5B58",
  enabledSuccess: "\u5DF2\u542F\u7528",
  disabledSuccess: "\u5DF2\u505C\u7528",
  fileEnabled: "\u5DF2\u542F\u7528",
  fileDisabled: "\u5DF2\u505C\u7528",
  diskState: "\u6280\u80FD\u72B6\u6001",
  runtimeState: "\u6240\u9009\u6A21\u5F0F",
  stateLayersHint: "\u6280\u80FD\u542F\u7528\u540E\uFF0C\u80FD\u5426\u4F7F\u7528\u8FD8\u53D6\u51B3\u4E8E\u6240\u9009\u6A21\u5F0F\u3002\u8FD9\u91CC\u4F1A\u663E\u793A\u8BE5\u6A21\u5F0F\u4E0B\u7684\u5B9E\u9645\u72B6\u6001\u3002",
  runtimeStateHint: "\u6709\u4E9B\u6A21\u5F0F\u4E0D\u652F\u6301\u672C\u5730\u6280\u80FD\u3002\u6280\u80FD\u53EF\u4EE5\u4FDD\u6301\u542F\u7528\uFF0C\u9009\u62E9\u5176\u4ED6\u6A21\u5F0F\u5373\u53EF\u67E5\u770B\u80FD\u5426\u4F7F\u7528\u3002",
  runtimeAvailable: "\u53EF\u7528",
  runtimeUnavailable: "\u6B64\u6A21\u5F0F\u4E0D\u53EF\u7528",
  runtimeOff: "\u5DF2\u505C\u7528",
  runtimeUnknown: "\u5C1A\u672A\u786E\u8BA4",
  availability_available: "\u53EF\u7528",
  availability_disabled: "\u5DF2\u505C\u7528",
  availability_shadowed: "\u4F7F\u7528\u53E6\u4E00\u4EFD\u540C\u540D\u6280\u80FD",
  availability_not_in_preset: "\u6B64\u6A21\u5F0F\u4E0D\u53EF\u7528",
  availability_unknown: "\u5C1A\u672A\u786E\u8BA4",
  importTitle: "\u5BFC\u5165\u6280\u80FD",
  importHint: "\u4ECE GitHub \u6216\u672C\u5730\u6587\u4EF6\u6DFB\u52A0\u6280\u80FD\u3002",
  preview: "\u4E0B\u4E00\u6B65",
  importNow: "\u5BFC\u5165",
  previewTitle: "\u5C06\u8981\u5BFC\u5165\u7684\u6280\u80FD",
  ready: "\u53EF\u4EE5\u5BFC\u5165",
  conflict: "\u6B64\u4F4D\u7F6E\u5DF2\u5B58\u5728",
  conflictHint: "\u6B64\u4F4D\u7F6E\u5DF2\u6709\u540C\u540D\u6280\u80FD\uFF0C\u73B0\u6709\u5185\u5BB9\u4F1A\u4FDD\u7559\u3002",
  githubUrl: "GitHub \u6280\u80FD\u7F51\u5740",
  previewCommitHint: "\u672C\u6B21\u5BFC\u5165\u4F7F\u7528\u8FD9\u91CC\u663E\u793A\u7684\u7248\u672C\u3002",
  savePolicy: "\u4FDD\u5B58\u8BBE\u7F6E",
  policyOnFile: "\u8BBE\u7F6E\u5DF2\u4FDD\u5B58",
  policyUnsaved: "\u8BBE\u7F6E\u5C1A\u672A\u4FDD\u5B58",
  historyContextHint: "\u4FEE\u6539\u5F71\u54CD\u540E\u7EED\u4F7F\u7528\uFF1B\u4F1A\u8BDD\u4E4B\u524D\u52A0\u8F7D\u7684\u5185\u5BB9\u4ECD\u4FDD\u7559\u5728\u5386\u53F2\u4E2D\u3002",
  syncDetails: "\u66F4\u65B0\u72B6\u6001",
  refreshAfterSaveFailed: "\u5DF2\u4FDD\u5B58\uFF0C\u4F46\u5217\u8868\u6682\u65F6\u672A\u66F4\u65B0\u3002\u6587\u4EF6\u5DF2\u4FDD\u7559\uFF0C\u53EF\u5237\u65B0\u5217\u8868\u67E5\u770B\u3002",
  errorDetails: "\u9519\u8BEF\u8BE6\u60C5",
  copyError: "\u590D\u5236\u9519\u8BEF",
  copyFallback: "\u8BF7\u9009\u4E2D\u5E76\u590D\u5236\u4E0B\u65B9\u8BE6\u60C5\u3002",
  errorRetry: "\u91CD\u8BD5\u4FDD\u5B58",
  error_FILE_BUSY: "\u6587\u4EF6\u6B63\u88AB\u5176\u4ED6\u7A0B\u5E8F\u5360\u7528\uFF0C\u6682\u65F6\u65E0\u6CD5\u4FDD\u5B58\u3002\u4FEE\u6539\u4ECD\u4FDD\u7559\u5728\u8FD9\u91CC\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
  error_FILE_ACCESS: "\u6682\u65F6\u65E0\u6CD5\u5199\u5165\u6587\u4EF6\u3002\u8BF7\u68C0\u67E5\u6587\u4EF6\u662F\u5426\u88AB\u5360\u7528\uFF0C\u6216\u5F53\u524D\u8D26\u53F7\u662F\u5426\u6709\u5199\u5165\u6743\u9650\u3002\u4FEE\u6539\u4ECD\u4FDD\u7559\u5728\u8FD9\u91CC\u3002",
  error_EBUSY: "\u6587\u4EF6\u6B63\u88AB\u5176\u4ED6\u7A0B\u5E8F\u5360\u7528\uFF0C\u6682\u65F6\u65E0\u6CD5\u4FDD\u5B58\u3002\u4FEE\u6539\u4ECD\u4FDD\u7559\u5728\u8FD9\u91CC\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
  error_EPERM: "\u6682\u65F6\u65E0\u6CD5\u5199\u5165\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u6587\u4EF6\u5360\u7528\u548C\u5199\u5165\u6743\u9650\u3002",
  error_EACCES: "\u6682\u65F6\u65E0\u6CD5\u5199\u5165\u6587\u4EF6\uFF0C\u8BF7\u68C0\u67E5\u6587\u4EF6\u5360\u7528\u548C\u5199\u5165\u6743\u9650\u3002",
  error_RECOVERY_REQUIRED: "\u64CD\u4F5C\u672A\u5B8C\u6210\uFF0C\u539F\u6587\u4EF6\u5DF2\u4FDD\u7559\u3002\u8BF7\u67E5\u770B\u9519\u8BEF\u8BE6\u60C5\u4E2D\u7684\u6062\u590D\u4F4D\u7F6E\u3002",
  error_ENOSPC: "\u78C1\u76D8\u7A7A\u95F4\u4E0D\u8DB3\uFF0C\u6682\u65F6\u65E0\u6CD5\u4FDD\u5B58\u3002\u4FEE\u6539\u4ECD\u4FDD\u7559\u5728\u8FD9\u91CC\uFF0C\u8BF7\u91CA\u653E\u7A7A\u95F4\u540E\u91CD\u8BD5\u3002",
  savedPartial: "\u90E8\u5206\u6280\u80FD\u5DF2\u5BFC\u5165\uFF0C\u4EE5\u4E0B\u9879\u76EE\u672A\u80FD\u5BFC\u5165\u3002",
  cleanupPending: "\u5DF2\u4FDD\u5B58\uFF0C\u90E8\u5206\u4E34\u65F6\u6587\u4EF6\u7A0D\u540E\u6E05\u7406\u3002",
  saveTo: "\u4FDD\u5B58\u5230"
});
Object.assign(en, {
  currentModeView: "Current mode",
  libraryView: "Skill library",
  modeViewLabel: "Skill view",
  modeViewHelp: "Only skills DSH has confirmed can be called in this mode appear here. Model use and / commands may have different lists.",
  libraryViewHelp: "Manage skill files here. An enabled file may still be unavailable in the selected mode.",
  modeSummary: "Available in mode",
  librarySummary: "Skill library",
  catalogUnknown: "The full skill list could not be confirmed. Refresh to check again.",
  confirmedSkills: "Confirmed",
  automaticFilter: "Model use",
  manualFilter: "/ Commands",
  allInvocation: "All invocation types",
  modeEmpty: "No skills available in this mode",
  modeEmptyHint: "Choose another mode, or manage local files in the skill library.",
  providerProvided: "Provided by plugin",
  providerPolicyHint: "Invocation settings are controlled by the plugin that provides this skill.",
  libraryEmpty: "No skills in this library",
  catalogConfirmedHint: "Only confirmed available skills appear below. The full count has not been confirmed.",
  fileEnableHelp: "This file switch affects every mode and app that reads the same file. It does not enable the skill for this mode alone.",
  enableFile: "Enable file",
  disableFile: "Disable file",
  availableInMode: "Available in this mode",
  noInvocation: "Invocation not allowed",
  availability_invocation_disabled: "Invocation not allowed",
  fileEnabled: "File enabled",
  fileDisabled: "File disabled",
  diskState: "File status",
  stateLayersHint: "File status controls discovery from disk. The selected mode determines whether the skill is available here.",
  runtimeStateHint: "This status comes from the selected mode. File enablement alone does not make a skill available in every mode.",
  personalHint: "These files are shared across workspaces. Availability depends on the selected mode. Shared skills may also be used by other apps.",
  workspaceHint: "These skill files are saved in this workspace. Availability depends on the selected mode.",
  policyHint: "In modes that provide this skill, automatic selection lets the model decide when to use it, while / commands add it to the input\u2019s skill menu. Set each independently."
});
Object.assign(zh, {
  currentModeView: "\u5F53\u524D\u6A21\u5F0F",
  libraryView: "\u6280\u80FD\u5E93",
  modeViewLabel: "\u67E5\u770B\u8303\u56F4",
  modeViewHelp: "\u8FD9\u91CC\u53EA\u663E\u793A DSH \u5DF2\u786E\u8BA4\u5F53\u524D\u6A21\u5F0F\u53EF\u8C03\u7528\u7684\u6280\u80FD\u3002\u6A21\u578B\u81EA\u52A8\u4F7F\u7528\u4E0E / \u624B\u52A8\u8C03\u7528\u7684\u540D\u5355\u53EF\u80FD\u4E0D\u540C\u3002",
  libraryViewHelp: "\u5728\u8FD9\u91CC\u7BA1\u7406\u6280\u80FD\u6587\u4EF6\u3002\u6587\u4EF6\u5DF2\u542F\u7528\uFF0C\u4E0D\u4EE3\u8868\u6240\u9009\u6A21\u5F0F\u80FD\u591F\u4F7F\u7528\u3002",
  modeSummary: "\u5F53\u524D\u6A21\u5F0F\u53EF\u7528",
  librarySummary: "\u6280\u80FD\u5E93",
  catalogUnknown: "\u6682\u65F6\u65E0\u6CD5\u786E\u8BA4\u5168\u90E8\u6280\u80FD\uFF0C\u8BF7\u5237\u65B0\u3002",
  confirmedSkills: "\u5DF2\u786E\u8BA4",
  automaticFilter: "\u6A21\u578B\u81EA\u52A8\u4F7F\u7528",
  manualFilter: "/ \u624B\u52A8\u8C03\u7528",
  allInvocation: "\u5168\u90E8\u8C03\u7528\u65B9\u5F0F",
  modeEmpty: "\u6B64\u6A21\u5F0F\u6CA1\u6709\u53EF\u7528\u6280\u80FD",
  modeEmptyHint: "\u53EF\u4EE5\u9009\u62E9\u5176\u4ED6\u6A21\u5F0F\uFF0C\u6216\u5728\u6280\u80FD\u5E93\u4E2D\u7BA1\u7406\u672C\u5730\u6280\u80FD\u3002",
  providerProvided: "\u63D2\u4EF6\u63D0\u4F9B",
  providerPolicyHint: "\u8C03\u7528\u65B9\u5F0F\u7531\u63D0\u4F9B\u6B64\u6280\u80FD\u7684\u63D2\u4EF6\u51B3\u5B9A\u3002",
  libraryEmpty: "\u6280\u80FD\u5E93\u4E2D\u6CA1\u6709\u6280\u80FD",
  catalogConfirmedHint: "\u4E0B\u9762\u4EC5\u663E\u793A\u5DF2\u786E\u8BA4\u53EF\u7528\u7684\u6280\u80FD\uFF0C\u5B8C\u6574\u6570\u91CF\u5C1A\u672A\u786E\u8BA4\u3002",
  fileEnableHelp: "\u6587\u4EF6\u5F00\u5173\u5F71\u54CD\u8BFB\u53D6\u540C\u4E00\u6587\u4EF6\u7684\u6A21\u5F0F\u548C\u5176\u4ED6\u5E94\u7528\uFF0C\u5E76\u4E0D\u5355\u72EC\u6539\u53D8\u5F53\u524D\u6A21\u5F0F\u3002",
  enableFile: "\u542F\u7528\u6587\u4EF6",
  disableFile: "\u505C\u7528\u6587\u4EF6",
  availableInMode: "\u5F53\u524D\u6A21\u5F0F\u53EF\u7528",
  noInvocation: "\u672A\u5141\u8BB8\u8C03\u7528",
  availability_invocation_disabled: "\u672A\u5141\u8BB8\u8C03\u7528",
  fileEnabled: "\u6587\u4EF6\u5DF2\u542F\u7528",
  fileDisabled: "\u6587\u4EF6\u5DF2\u505C\u7528",
  diskState: "\u6587\u4EF6\u72B6\u6001",
  stateLayersHint: "\u6587\u4EF6\u72B6\u6001\u63A7\u5236\u78C1\u76D8\u4E2D\u7684\u6280\u80FD\u662F\u5426\u53C2\u4E0E\u53D1\u73B0\uFF1B\u5F53\u524D\u6A21\u5F0F\u80FD\u5426\u4F7F\u7528\uFF0C\u4F1A\u5355\u72EC\u663E\u793A\u3002",
  runtimeStateHint: "\u8FD9\u91CC\u663E\u793A\u6240\u9009\u6A21\u5F0F\u7684\u5B9E\u9645\u72B6\u6001\u3002\u6587\u4EF6\u5DF2\u542F\u7528\uFF0C\u4E0D\u4EE3\u8868\u6BCF\u4E2A\u6A21\u5F0F\u90FD\u80FD\u4F7F\u7528\u3002",
  personalHint: "\u8FD9\u4E9B\u6587\u4EF6\u53EF\u4F9B\u591A\u4E2A\u5DE5\u4F5C\u533A\u8BFB\u53D6\uFF0C\u80FD\u5426\u8C03\u7528\u53D6\u51B3\u4E8E\u6240\u9009\u6A21\u5F0F\u3002\u5171\u4EAB\u6280\u80FD\u4E5F\u53EF\u80FD\u88AB\u5176\u4ED6\u5E94\u7528\u4F7F\u7528\u3002",
  workspaceHint: "\u8FD9\u4E9B\u6280\u80FD\u6587\u4EF6\u4FDD\u5B58\u5728\u6B64\u5DE5\u4F5C\u533A\u4E2D\uFF0C\u80FD\u5426\u8C03\u7528\u53D6\u51B3\u4E8E\u6240\u9009\u6A21\u5F0F\u3002",
  policyHint: "\u5728\u652F\u6301\u6B64\u6280\u80FD\u7684\u6A21\u5F0F\u4E2D\uFF0C\u81EA\u52A8\u9009\u7528\u7531\u6A21\u578B\u5224\u65AD\u4F55\u65F6\u4F7F\u7528\uFF1B/\u624B\u52A8\u8C03\u7528\u4F1A\u663E\u793A\u5728\u8F93\u5165\u6846\u7684\u6280\u80FD\u83DC\u5355\u4E2D\u3002\u4E24\u8005\u53EF\u5206\u522B\u8BBE\u7F6E\u3002"
});
Object.assign(en, { noSkillsHint: "Import or create a skill to edit and manage it here." });
Object.assign(zh, { noSkillsHint: "\u5BFC\u5165\u6216\u65B0\u5EFA\u6280\u80FD\uFF0C\u4E4B\u540E\u53EF\u5728\u8FD9\u91CC\u7F16\u8F91\u548C\u7BA1\u7406\u3002" });

// package.json
var version = "0.2.2";

// src/Panel.jsx
var import_jsx_runtime = require("react/jsx-runtime");
var paths = {
  spark: ["m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"],
  plus: ["M12 5v14", "M5 12h14"],
  search: ["M21 21l-5-5", "M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"],
  upload: ["M12 16V3", "m7 8 5-5 5 5", "M4 16v4h16v-4"],
  download: ["M12 3v13", "m7 11 5 5 5-5", "M4 17v4h16v-4"],
  refresh: ["M20 7v5h-5", "M4 17v-5h5", "M6 6a8 8 0 0 1 14 6", "M18 18a8 8 0 0 1-14-6"],
  arrow: ["m14 6-6 6 6 6"],
  close: ["M6 6l12 12", "M6 18 18 6"],
  folder: ["M3 6h6l2 3h10v11H3V6Z"],
  grid: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M3 14h7v7H3z", "M14 14h7v7h-7z"],
  list: ["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.1", "M3 12h.1", "M3 18h.1"],
  file: ["M6 3h8l4 4v14H6V3Z", "M14 3v5h4", "M9 12h6", "M9 16h6"],
  history: ["M3 4v6h6", "M3 10a9 9 0 1 1 1 8", "M12 7v5l3 2"],
  check: ["m5 12 4 4L19 6"],
  alert: ["M12 3 2 21h20L12 3Z", "M12 9v5", "M12 17v.1"],
  trash: ["M3 6h18", "M9 6V3h6v3", "M6 6l1 15h10l1-15", "M10 10v7", "M14 10v7"],
  lock: ["M6 10h12v11H6z", "M8 10V6a4 4 0 0 1 8 0v4"],
  bolt: ["m13 2-9 12h7l-1 8 10-12h-7l1-8Z"],
  code: ["m8 6-6 6 6 6", "m16 6 6 6-6 6", "m14 3-4 18"],
  copy: ["M8 8h13v13H8z", "M16 8V3H3v13h5"]
};
function Icon({ name, size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: (paths[name] || paths.file).map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d }, i)) });
}
function Button({ children, icon, primary = false, danger = false, className = "", ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: `dss-btn ${primary ? "dss-btn-primary" : ""} ${danger ? "dss-btn-danger" : ""} ${className}`, ...props, children: [
    icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: icon }),
    children
  ] });
}
function Empty({ title, hint, children, icon = "spark" }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-empty", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-emptyicon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: icon, size: 26 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: hint }),
    children
  ] });
}
function sourceLabel(source, t) {
  const key = `source_${String(source).replaceAll("-", "_")}`;
  const value = t(key);
  return value === key ? source : value;
}
function scopeOf(source) {
  return String(source).startsWith("project") ? "workspace" : ["bundled", "runtime"].includes(source) ? "provided" : String(source).startsWith("user") ? "global" : "custom";
}
function presetDisplayName(preset = {}, t) {
  if (preset.name !== void 0) return preset.name;
  const key = { standard: "modeStandard", ptc: "modePtc", minimal: "modeMinimal", cordis: "modeCordis" }[preset.id];
  return key ? t(key) : preset.id || t("unknownMode");
}
function rootLabel(root, t, workspaceLabel) {
  if (String(root.source).startsWith("project")) return `${workspaceLabel || t("scope_workspace")}${String(root.source).includes("agents") ? ` \xB7 ${t("sharedSkills")}` : ""}`;
  if (root.source === "user-dsh") return t("personalSkills");
  if (root.source === "user-agents") return t("sharedSkills");
  if (["bundled", "runtime"].includes(root.source)) return t("scope_provided");
  return root.label || sourceLabel(root.source, t);
}
function errorDetails(error) {
  return [error?.code, error?.fsCode, error?.message, error?.recoveryPath].filter(Boolean).join("\n");
}
function errorText(error, t) {
  const code = error?.code || (/\b(CONFLICT|HASH_MISMATCH|READ_ONLY|NOT_FOUND|INVALID_PATH|INVALID_SKILL|PREVIEW_EXPIRED|LIMIT)\b/.exec(error?.message || "") || [])[1];
  const translated = code && t(`error_${code}`);
  return translated && translated !== `error_${code}` ? translated : error?.message || t("unknownError");
}
function download(base64, filename) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/zip" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function encodeFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
function decodeFile(base64) {
  try {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    if (bytes.length > 2e5 || bytes.includes(0)) return null;
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}
function encodeText(text) {
  let value = "";
  for (const byte of new TextEncoder().encode(text)) value += String.fromCharCode(byte);
  return btoa(value);
}
function invocationOf(text, fallback = {}) {
  const header = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text.replace(/^\uFEFF/, ""))?.[1];
  if (header === void 0) return { model: fallback.modelInvocable !== false, user: fallback.userInvocable !== false, editable: false };
  return { model: !/^disable-model-invocation:\s*true\s*(?:#.*)?$/mi.test(header), user: !/^user-invocable:\s*false\s*(?:#.*)?$/mi.test(header), editable: true };
}
function markdownBody(text = "") {
  return text.replace(/^\uFEFF/, "").replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "");
}
function inline(text) {
  return String(text).split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^\s)]+\))/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: part.slice(1, -1) }, i);
    if (part.startsWith("**") && part.endsWith("**")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: part.slice(2, -2) }, i);
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link && /^https?:\/\//i.test(link[2])) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: link[2], target: "_blank", rel: "noreferrer noopener", children: link[1] }, i);
    return part;
  });
}
function SkillMarkdown({ text }) {
  const lines = markdownBody(text).replace(/\r\n/g, "\n").split("\n"), blocks = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index++;
      continue;
    }
    if (/^\s*```/.test(line)) {
      const code = [];
      const language = line.replace(/^\s*```/, "").trim();
      index++;
      while (index < lines.length && !/^\s*```/.test(lines[index])) code.push(lines[index++]);
      index++;
      blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { "data-language": language, children: code.join("\n") }) }, blocks.length));
      continue;
    }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push(import_react.default.createElement(`h${heading[1].length}`, { key: blocks.length }, inline(heading[2])));
      index++;
      continue;
    }
    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}, blocks.length));
      index++;
      continue;
    }
    if (/^\s*(?:[-+*]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]/.test(line), items = [];
      while (index < lines.length && /^\s*(?:[-+*]|\d+[.)])\s+/.test(lines[index])) items.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(lines[index++].replace(/^\s*(?:[-+*]|\d+[.)])\s+/, "")) }, items.length));
      blocks.push(import_react.default.createElement(ordered ? "ol" : "ul", { key: blocks.length }, items));
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ""));
      blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", { children: inline(quote.join("\n")) }, blocks.length));
      continue;
    }
    const paragraph = [line];
    index++;
    while (index < lines.length && lines[index].trim() && !/^(?:#{1,6}\s|\s*```|>\s?|\s*(?:[-+*]|\d+[.)])\s+)/.test(lines[index])) paragraph.push(lines[index++]);
    blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: inline(paragraph.join("\n")) }, blocks.length));
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-markdown", children: blocks });
}
function issueMessage(issue, t) {
  const key = `diagnostic_${issue.code}`;
  return t(key) !== key ? t(key) : issue.message || issue.code;
}
function IssueList({ issues = [], t }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    !issues.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-checkpass", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check", size: 18 }),
      t("checksPass")
    ] }) : issues.map((issue, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-issue", "data-severity": issue.severity || "warning", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
        issue.code,
        " \xB7 ",
        t(`issue_${issue.severity || "warning"}`)
      ] }),
      issueMessage(issue, t)
    ] }, `${issue.code}-${index}`)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-checkhelp", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("diagnostics"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("checksHint") }) }) })
  ] });
}
function helpPlacement(anchor, bounds, contentHeight = 180) {
  const gutter = 10, gap = 8, width = Math.min(320, Math.max(1, bounds.right - bounds.left - gutter * 2));
  const below = Math.max(0, bounds.bottom - anchor.bottom - gap - gutter);
  const above = Math.max(0, anchor.top - bounds.top - gap - gutter);
  const maxHeight = Math.max(1, Math.min(300, Math.max(below, above)));
  const height = Math.min(contentHeight, maxHeight);
  const x = Math.min(Math.max(anchor.left, bounds.left + gutter), bounds.right - gutter - width);
  const y = below >= height || below >= above ? anchor.bottom + gap : anchor.top - gap - height;
  return { left: x - anchor.left, top: y - anchor.top, width, maxHeight, visibility: "visible" };
}
function Help({ label, children }) {
  const [open, setOpen] = (0, import_react.useState)(false), [position, setPosition] = (0, import_react.useState)(null);
  const ref = (0, import_react.useRef)(null), button = (0, import_react.useRef)(null), popover = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const node = ref.current, root = node.closest(".dss");
    const place = () => {
      if (!popover.current || !root) return;
      const rootBox = root.getBoundingClientRect();
      const bounds = { left: rootBox.left, right: rootBox.right, top: rootBox.top, bottom: rootBox.bottom };
      for (let parent = node.parentElement; parent && parent !== root; parent = parent.parentElement) {
        const style = getComputedStyle(parent), box = parent.getBoundingClientRect();
        if (/auto|scroll|hidden|clip/.test(style.overflowX)) {
          bounds.left = Math.max(bounds.left, box.left);
          bounds.right = Math.min(bounds.right, box.right);
        }
        if (/auto|scroll|hidden|clip/.test(style.overflowY)) {
          bounds.top = Math.max(bounds.top, box.top);
          bounds.bottom = Math.min(bounds.bottom, box.bottom);
        }
      }
      const next = helpPlacement(node.getBoundingClientRect(), bounds, popover.current.scrollHeight + 2);
      setPosition((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    place();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    if (root) observer?.observe(root);
    if (popover.current) observer?.observe(popover.current);
    window.addEventListener("resize", place);
    root?.addEventListener("scroll", place, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", place);
      root?.removeEventListener("scroll", place, true);
    };
  }, [open, children]);
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dss-help", ref, onKeyDown: (event) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      setOpen(false);
      button.current?.focus();
    }
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-helpbutton", ref: button, "aria-label": label, "aria-expanded": open, onClick: () => {
      setPosition(null);
      setOpen((value) => !value);
    }, children: "?" }),
    open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dss-helppopover", role: "note", ref: popover, style: position || { visibility: "hidden" }, children })
  ] });
}
function Modal({ title, hint, close, children, footer, drawer = false, busy, t, tabs }) {
  const ref = (0, import_react.useRef)(null), closeRef = (0, import_react.useRef)(close);
  closeRef.current = close;
  (0, import_react.useEffect)(() => {
    const previous = document.activeElement, node = ref.current;
    const focusables = () => [...node.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href],[tabindex="0"]')].filter((item) => !item.hidden);
    (focusables()[0] || node).focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key === "Tab") {
        const items = focusables(), first = items[0], last = items.at(-1);
        if (!items.length) {
          event.preventDefault();
          node.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("keydown", onKey);
      if (previous?.isConnected) previous.focus?.();
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-overlay", onMouseDown: (event) => {
    if (event.target === event.currentTarget) close();
  }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: `dss-modal ${drawer ? "dss-modal-wide" : ""}`, role: "dialog", "aria-modal": "true", "aria-label": title, "aria-busy": busy, tabIndex: -1, ref, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "dss-modalheader", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }),
        hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: title, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: hint }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "close", disabled: busy, onClick: close, children: t("close") })
    ] }),
    tabs,
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-modalbody", children }),
    footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", { className: "dss-modalfooter", children: footer })
  ] }) });
}
function Panel({ call: request, t: suppliedT, back, externalRevision }) {
  const t = (0, import_react.useCallback)((key) => {
    const value = suppliedT?.(key);
    return value === void 0 || value === null || value === "" ? en[key] || key : value;
  }, [suppliedT]);
  const [workspaceId, setWorkspaceId] = (0, import_react.useState)("current"), [presetId, setPresetId] = (0, import_react.useState)("current"), [contexts, setContexts] = (0, import_react.useState)(null);
  const call = (0, import_react.useCallback)((action, args = {}) => request(action, { ...args, workspaceId, presetId }), [request, workspaceId, presetId]);
  (0, import_react.useEffect)(() => {
    request("contexts", { workspaceId: "current", presetId: "current" }).then(setContexts).catch(() => setContexts(null));
  }, [request]);
  const [snapshot, setSnapshot] = (0, import_react.useState)(null), [loading, setLoading] = (0, import_react.useState)(true), [pending, setPending] = (0, import_react.useState)(false), [notice, setNotice] = (0, import_react.useState)(null), [errorCopied, setErrorCopied] = (0, import_react.useState)(false);
  const [collectionView, setCollectionView] = (0, import_react.useState)("mode"), [invocationFilter, setInvocationFilter] = (0, import_react.useState)("all");
  const [query, setQuery] = (0, import_react.useState)(""), [root, setRoot] = (0, import_react.useState)("all"), [scope, setScope] = (0, import_react.useState)("all"), [status, setStatus] = (0, import_react.useState)("all"), [issuesOnly, setIssuesOnly] = (0, import_react.useState)(false), [view, setView] = (0, import_react.useState)("list"), [selection, setSelection] = (0, import_react.useState)(/* @__PURE__ */ new Set());
  const [dialog, setDialog] = (0, import_react.useState)(null), [detail, setDetail] = (0, import_react.useState)(null), [editor, setEditor] = (0, import_react.useState)(""), [tab, setTab] = (0, import_react.useState)("overview"), [lint, setLint] = (0, import_react.useState)(null), [resource, setResource] = (0, import_react.useState)(null), [resourceText, setResourceText] = (0, import_react.useState)(""), [policy, setPolicy] = (0, import_react.useState)({ model: true, user: true });
  const [history, setHistory] = (0, import_react.useState)([]), [newName, setNewName] = (0, import_react.useState)(""), [newDescription, setNewDescription] = (0, import_react.useState)(""), [template, setTemplate] = (0, import_react.useState)("General"), [newResourcePath, setNewResourcePath] = (0, import_react.useState)("");
  const [targetRoot, setTargetRoot] = (0, import_react.useState)(""), [importMode, setImportMode] = (0, import_react.useState)("github"), [githubUrl, setGithubUrl] = (0, import_react.useState)(""), [uploads, setUploads] = (0, import_react.useState)([]), [preview, setPreview] = (0, import_react.useState)(null);
  const fileInput = (0, import_react.useRef)(null), folderInput = (0, import_react.useRef)(null), resourceInput = (0, import_react.useRef)(null), busyRef = (0, import_react.useRef)(false), listGeneration = (0, import_react.useRef)(0), lintGeneration = (0, import_react.useRef)(0), alive = (0, import_react.useRef)(true), detailRef = (0, import_react.useRef)(null), revisionRef = (0, import_react.useRef)(externalRevision), postRefreshError = (0, import_react.useRef)(null);
  const resourceDirty = !!resource && decodeFile(resource.base64) !== null && resourceText !== decodeFile(resource.base64);
  const instructionDirty = !!detail && editor !== detail.text;
  const policyDirty = !!detail && (policy.model !== (detail.skill.modelInvocable !== false) || policy.user !== (detail.skill.userInvocable !== false));
  const dirty = instructionDirty || resourceDirty || policyDirty;
  const roots = snapshot?.roots || [], skills = snapshot?.skills || [], writableRoots = roots.filter((item) => item.writable !== false);
  const libraryMode = collectionView === "library";
  const catalog = snapshot?.catalog;
  const catalogComplete = catalog?.complete === true;
  const availableIds = new Set(catalog?.availableIds || []), automaticIds = new Set(catalog?.automaticIds || []), manualIds = new Set(catalog?.manualIds || []);
  const modeSkills = skills.filter((skill) => availableIds.has(skill.id));
  const viewSkills = libraryMode ? skills : modeSkills.filter((skill) => invocationFilter === "all" || (invocationFilter === "manual" ? manualIds : automaticIds).has(skill.id));
  const catalogCount = (key) => catalogComplete && Number.isFinite(catalog?.counts?.[key]) ? catalog.counts[key] : "\u2014";
  const workspaceLabel = snapshot?.context?.workspacePath ? snapshot.context.workspaceLabel : void 0;
  const currentWorkspaceLabel = workspaceId === "current" && snapshot?.context ? snapshot.context.workspacePath ? snapshot.context.workspaceLabel : void 0 : contexts?.workspaces?.find((item) => item.id === contexts?.current?.workspaceId)?.label;
  const currentPresetId = presetId === "current" && snapshot?.context ? snapshot.context.presetId : contexts?.current?.presetId;
  const modeLabel = presetDisplayName(contexts?.presets?.find((item) => item.id === currentPresetId) || { id: currentPresetId }, t);
  const hasSession = snapshot?.context?.hasSession === true;
  const locationLabel = (item) => String(item.source).startsWith("project") ? `${workspaceLabel || t("scope_workspace")} \xB7 ${t("locationWorkspace")}${String(item.source).includes("agents") ? ` \xB7 ${t("sharedSkills")}` : ""}` : item.source === "user-dsh" ? t("locationPersonal") : item.source === "user-agents" ? t("locationShared") : rootLabel(item, t, workspaceLabel);
  const showFailure = (error, area = null) => {
    setErrorCopied(false);
    setNotice((previous) => previous?.error && area === null ? previous : { error: true, errorInfo: { code: error?.code, fsCode: error?.fsCode, message: error?.message || String(error), recoveryPath: error?.recoveryPath }, text: errorText(error, t), area, skillId: detail?.skill?.id });
  };
  const setDetailState = (result) => {
    setDetail(result);
    setEditor(result.text || "");
    setPolicy({ model: result.skill.modelInvocable !== false, user: result.skill.userInvocable !== false });
    setResource(null);
    setResourceText("");
    setLint(null);
  };
  const refresh = (0, import_react.useCallback)(async (showLoading = false) => {
    const generation = ++listGeneration.current;
    if (showLoading) setLoading(true);
    try {
      const result = await call("list");
      if (alive.current && generation === listGeneration.current) {
        setSnapshot(result);
        setSelection((previous) => new Set([...previous].filter((id) => result.skills?.some((skill) => skill.id === id))));
      }
    } finally {
      if (alive.current && generation === listGeneration.current) setLoading(false);
    }
  }, [call]);
  (0, import_react.useEffect)(() => {
    alive.current = true;
    refresh(true).catch((error) => showFailure(error));
    return () => {
      alive.current = false;
      listGeneration.current++;
    };
  }, [refresh]);
  (0, import_react.useEffect)(() => {
    if (revisionRef.current === externalRevision) return;
    revisionRef.current = externalRevision;
    refresh().catch((error) => showFailure(error));
  }, [externalRevision, refresh]);
  (0, import_react.useEffect)(() => {
    if ((!targetRoot || !writableRoots.some((item) => item.id === targetRoot)) && writableRoots[0]) setTargetRoot(writableRoots[0].id);
  }, [snapshot]);
  (0, import_react.useEffect)(() => {
    if (!detail) return;
    const generation = ++lintGeneration.current, handle = setTimeout(() => {
      call("validate", { text: editor }).then((result) => {
        if (alive.current && generation === lintGeneration.current) setLint(result);
      }).catch(() => {
        if (alive.current && generation === lintGeneration.current) setLint(null);
      });
    }, 400);
    return () => {
      clearTimeout(handle);
      lintGeneration.current++;
    };
  }, [editor, detail?.skill?.id, call]);
  (0, import_react.useEffect)(() => {
    if (!dirty) return;
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  (0, import_react.useEffect)(() => {
    if (detail && !dialog) detailRef.current?.focus();
  }, [detail?.skill?.id, dialog]);
  const refreshAfterChange = async () => {
    try {
      await refresh();
    } catch (error) {
      postRefreshError.current = error;
    }
  };
  const run = async (operation, successText, after, area = null) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setPending(true);
    postRefreshError.current = null;
    setNotice((previous) => previous?.error ? previous : null);
    try {
      const result = await operation();
      if (!alive.current) return;
      if (after) await after(result);
      if (successText) setNotice((previous) => previous?.error && (previous.area !== area || previous.skillId !== detail?.skill?.id) ? previous : { text: successText, synchronization: result?.synchronization, warnings: result?.warnings, refreshError: postRefreshError.current && errorDetails(postRefreshError.current) });
      return result;
    } catch (error) {
      if (alive.current) showFailure(error, area);
      return void 0;
    } finally {
      busyRef.current = false;
      if (alive.current) setPending(false);
    }
  };
  const syncMessage = (result, base) => {
    const sync = result?.synchronization;
    if (!sync) return base;
    return `${base} \xB7 ${sync.catalog === "verified" && sync.menu === "synced" ? t("syncVerified") : sync.catalog === "verified" ? t("syncCatalog") : sync.catalog === "pending" ? t("syncPending") : t("syncUnknown")}${sync.menu === "failed" ? ` \xB7 ${t("syncMenuFailed")}` : sync.menu === "unsupported" ? ` \xB7 ${t("syncMenuUnsupported")}` : ""}`;
  };
  const changeContext = (kind, value) => {
    if (busyRef.current || !discard()) return;
    setDetail(null);
    setSelection(/* @__PURE__ */ new Set());
    setRoot("all");
    if (kind === "workspace") setWorkspaceId(value);
    else setPresetId(value);
  };
  const discard = () => !dirty || window.confirm(t("discardConfirm"));
  const closeDialog = () => {
    if (busyRef.current) return;
    setDialog(null);
    setPreview(null);
  };
  const closeDetail = () => {
    if (busyRef.current || !discard()) return;
    setDetail(null);
    setResource(null);
    setLint(null);
  };
  const openDialog = (next) => {
    if (busyRef.current || !discard()) return;
    if (detail) setDetailState(detail);
    setDialog(next);
    setPreview(null);
  };
  const openSkill = (skill) => {
    if (!discard()) return;
    run(() => call("read", { id: skill.id }), null, (result) => {
      setDetailState(result);
      setTab("overview");
      setDialog(null);
    });
  };
  const exportSkills = (ids) => run(async () => {
    const chosen = ids === void 0 ? visible.filter((skill) => !skill.readOnly && !String(skill.id).startsWith("provider:")).map((skill) => skill.id) : ids;
    const result = await call("export", { ids: chosen });
    download(result.base64, result.filename);
  }, t("exportDone"));
  const toggle = (skill, enabled) => {
    if (detail?.skill.id === skill.id && !discard()) return;
    run(() => call("toggle", { id: skill.id, enabled }), t(enabled ? "fileEnabled" : "fileDisabled"), async (result) => {
      if (detail?.skill.id === skill.id) setDetailState(result?.skill ? result : await call("read", { id: skill.id }));
      await refreshAfterChange();
    });
  };
  const bulkToggle = (enabled) => run(async () => {
    const chosen = activeSelectedIds.filter((id) => {
      const skill = skills.find((item) => item.id === id);
      return skill && !skill.readOnly && skill.enabled !== enabled;
    });
    const result = await call("batchToggle", { ids: chosen, enabled });
    if (detail && selection.has(detail.skill.id)) setDetailState(await call("read", { id: detail.skill.id }));
    await refreshAfterChange();
    const errors = result.results?.filter((item) => !item.success) || [];
    if (errors.length) setNotice((previous) => previous?.error ? previous : { error: true, text: `${syncMessage(result, t("partial"))}
${errors.map((item) => `${skills.find((skill) => skill.id === item.id)?.name || item.id}: ${errorText(item.error, t)}`).join("\n")}` });
    else setNotice((previous) => previous?.error ? previous : { text: t(enabled ? "fileEnabled" : "fileDisabled"), synchronization: result.synchronization, warnings: result.warnings });
    return result;
  });
  const visible = (0, import_react.useMemo)(() => viewSkills.filter((skill) => (root === "all" || skill.rootId === root) && (scope === "all" || scopeOf(skill.source) === scope) && (!libraryMode || status === "all" || (status === "enabled" ? skill.enabled : !skill.enabled)) && (!libraryMode || !issuesOnly || skill.issues?.length || skill.shadowedBy) && `${skill.name} ${skill.description} ${skill.path} ${skill.source}`.toLowerCase().includes(query.trim().toLowerCase())), [viewSkills, root, scope, status, issuesOnly, query, libraryMode]);
  const exportableVisible = visible.filter((skill) => !skill.readOnly && !String(skill.id).startsWith("provider:"));
  const selectableVisible = libraryMode ? exportableVisible : [], selectableIds = new Set(selectableVisible.map((skill) => skill.id));
  const activeSelectedIds = [...selection].filter((id) => selectableIds.has(id)), selectedCount = activeSelectedIds.length;
  const allVisibleSelected = !!selectableVisible.length && selectableVisible.every((skill) => selection.has(skill.id));
  const visibleSelectionKey = selectableVisible.map((skill) => skill.id).join("\0");
  (0, import_react.useEffect)(() => {
    setSelection((previous) => {
      const next = new Set([...previous].filter((id) => selectableIds.has(id)));
      return next.size === previous.size ? previous : next;
    });
  }, [visibleSelectionKey]);
  const resetFilters = () => {
    setSelection(/* @__PURE__ */ new Set());
    setQuery("");
    setRoot("all");
    setScope("all");
    setStatus("all");
    setIssuesOnly(false);
    setInvocationFilter("all");
  };
  const changeCollectionView = (next) => {
    if (busyRef.current || next === collectionView || !discard()) return;
    setDetail(null);
    setResource(null);
    setLint(null);
    resetFilters();
    setCollectionView(next);
  };
  const changeInvocationFilter = (next) => {
    if (busyRef.current || next === invocationFilter || !discard()) return;
    setDetail(null);
    setResource(null);
    setLint(null);
    setSelection(/* @__PURE__ */ new Set());
    setRoot("all");
    setScope("all");
    setInvocationFilter(next);
  };
  const hasFilters = !!query || root !== "all" || scope !== "all" || (libraryMode ? status !== "all" || issuesOnly : invocationFilter !== "all");
  const select = (id) => setSelection((previous) => {
    const next = new Set(previous);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const createSkill = () => run(async () => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(newName)) throw new Error(t("invalidName"));
    if (!newDescription.trim()) throw new Error(t("requiredDescription"));
    if (!targetRoot) throw new Error(t("chooseRoot"));
    const text = `---
name: ${newName}
description: ${JSON.stringify(newDescription.trim())}
---

${t(`template${template}Body`)}`;
    return call("create", { rootId: targetRoot, name: newName, description: newDescription.trim(), text });
  }, t("created"), async (result) => {
    setDialog(null);
    setCollectionView("library");
    resetFilters();
    setNewName("");
    setNewDescription("");
    if (result?.skill) {
      setDetailState(result);
      setTab("overview");
    }
    await refreshAfterChange();
  });
  const importPreview = () => run(async () => {
    if (!targetRoot) throw new Error(t("chooseRoot"));
    if (importMode === "github") {
      if (!githubUrl.trim()) throw new Error(t("requiredUrl"));
      return call("previewGithub", { rootId: targetRoot, url: githubUrl.trim() });
    }
    if (!uploads.length) throw new Error(t("noFile"));
    if (uploads.length > 2e3 || uploads.reduce((total, file) => total + file.size, 0) > 32 * 1024 * 1024) throw Object.assign(new Error(t("error_TOO_LARGE")), { code: "TOO_LARGE" });
    if (uploads.length === 1 && /\.zip$/i.test(uploads[0].name)) return call("previewImport", { rootId: targetRoot, zipBase64: await encodeFile(uploads[0]) });
    const files = [];
    for (const file of uploads) files.push({ path: file.webkitRelativePath || file.name, base64: await encodeFile(file) });
    return call("previewImport", { rootId: targetRoot, files });
  }, null, (result) => setPreview(result));
  const localFiles = (list) => {
    setUploads([...list]);
    setPreview(null);
  };
  const checkUpdate = () => {
    if (!discard()) return;
    run(() => call("previewUpdate", { id: detail.skill.id }), null, (result) => {
      setDetailState(detail);
      setPreview(result);
      setDialog("update");
    });
  };
  const chooseResource = (file) => {
    if (resourceDirty && !window.confirm(t("resourceUnsaved"))) return;
    setResource(file);
    setResourceText(decodeFile(file.base64) ?? "");
  };
  const saveInstructions = () => run(() => call("save", { id: detail.skill.id, text: editor, expectedHash: detail.hash }), t("saved"), async (result) => {
    setDetailState(result?.skill ? result : await call("read", { id: detail.skill.id }));
    await refreshAfterChange();
  }, "instructions");
  const savePolicy = () => run(() => call("setPolicy", { id: detail.skill.id, modelInvocable: policy.model, userInvocable: policy.user, expectedHash: detail.hash }), t("policySaved"), async (result) => {
    setDetailState(result);
    await refreshAfterChange();
  }, "policy");
  const copyError = async () => {
    const value = notice?.errorInfo ? errorDetails(notice.errorInfo) : notice?.text || "";
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setErrorCopied(true);
    } catch {
      setErrorCopied(false);
      setNotice((previous) => ({ ...previous, copyFailed: true }));
    }
  };
  const displayNotice = (inline2 = false) => notice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `dss-banner ${notice.error ? "dss-banner-error" : ""} ${inline2 ? "dss-saveerror" : ""}`, role: notice.error ? "alert" : "status", "data-persistent": !!notice.error, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: notice.error ? "alert" : "check", size: 17 }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      notice.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("errorTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { whiteSpace: "pre-wrap" }, children: notice.errorInfo ? errorText(notice.errorInfo, t) : notice.text }),
      notice.refreshError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("refreshAfterSaveFailed") }),
      notice.warnings?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("cleanupPending") }),
      notice.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-erroractions", children: [
        notice.skillId === detail?.skill?.id && ["policy", "instructions"].includes(notice.area) && notice.errorInfo?.code !== "RECOVERY_REQUIRED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { disabled: pending, icon: "refresh", onClick: notice.area === "policy" ? savePolicy : saveInstructions, children: pending ? t("working") : t("errorRetry") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "copy", onClick: copyError, children: errorCopied ? t("copied") : t("copyError") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { open: notice.copyFailed || void 0, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: t("errorDetails") }),
          notice.copyFailed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("copyFallback") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { tabIndex: 0, children: notice.errorInfo ? errorDetails(notice.errorInfo) : notice.text })
        ] })
      ] }),
      !notice.error && (notice.synchronization || notice.refreshError || notice.warnings?.length) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Help, { label: t("syncDetails"), children: [
        notice.synchronization && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: syncMessage(notice, "").replace(/^ · /, "") }),
        notice.refreshError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: notice.refreshError }),
        notice.warnings?.map((warning, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
          warning.code,
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
          warning.message,
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
          warning.recoveryPath
        ] }, index))
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-iconbtn", onClick: () => setNotice(null), "aria-label": t("close"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "close", size: 14 }) })
  ] });
  const rootSelect = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dss-field", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(dialog === "import" ? "location" : "saveTo") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "dss-select", value: targetRoot, disabled: pending, onChange: (event) => {
      setTargetRoot(event.target.value);
      setPreview(null);
    }, "aria-label": t(dialog === "import" ? "location" : "saveTo"), children: [
      !writableRoots.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: t("noWritableRoot") }),
      writableRoots.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: item.id, children: locationLabel(item) }, item.id))
    ] }),
    roots.find((item) => item.id === targetRoot)?.path && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dss-locationhelp", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("advancedPath") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("advancedPath"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: roots.find((item) => item.id === targetRoot).path }) })
    ] })
  ] });
  const listedDetail = skills.find((skill) => skill.id === detail?.skill?.id);
  const detailSkill = detail ? { ...detail.skill, ...listedDetail ? { availability: listedDetail.availability || detail.skill.availability, effective: listedDetail.effective, shadowedBy: listedDetail.shadowedBy } : {} } : {}, liveIssues = lint?.issues || detailSkill.issues || [], invocation = invocationOf(editor, detailSkill), providerOnly = String(detailSkill.id || "").startsWith("provider:");
  const externalChanged = !!detail && !!listedDetail?.hash && listedDetail.hash !== detail.hash;
  const runtimeLabel = (skill) => {
    if (!skill.enabled) return t("runtimeOff");
    if (skill.valid === false) return t("runtimeInvalid");
    if (skill.shadowedBy) return t("runtimeShadowed");
    return t(`availability_${skill.availability?.status || "unknown"}`);
  };
  const renderPolicy = () => detailSkill.readOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dss-section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-sectiontitle", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t("policy") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("policy"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t(providerOnly ? "providerPolicyHint" : "readOnly") }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-badges", children: [
      detailSkill.availability?.automatic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dss-badge", children: t("automaticFilter") }),
      detailSkill.availability?.manual && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dss-badge", children: t("manualFilter") }),
      !detailSkill.availability?.automatic && !detailSkill.availability?.manual && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dss-badge", children: runtimeLabel(detailSkill) })
    ] })
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dss-section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-sectiontitle", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t("policy") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("policy"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("policyHint") }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-policyrow", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("allowModel") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-switch", role: "switch", "aria-label": t("allowModel"), "aria-checked": policy.model, "data-on": policy.model, disabled: pending || detailSkill.readOnly || !invocation.editable || instructionDirty || resourceDirty, onClick: () => setPolicy((previous) => ({ ...previous, model: !previous.model })) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-policyrow", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("allowUser") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: [
          "/",
          detailSkill.name
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-switch", role: "switch", "aria-label": t("allowUser"), "aria-checked": policy.user, "data-on": policy.user, disabled: pending || detailSkill.readOnly || !invocation.editable || instructionDirty || resourceDirty, onClick: () => setPolicy((previous) => ({ ...previous, user: !previous.user })) })
    ] }),
    !policy.model && !policy.user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dss-inlinewarning", children: t("neitherHint") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-policyactions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: policyDirty ? "dss-unsaved" : "dss-dim", children: policyDirty ? t("policyUnsaved") : t("policyOnFile") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { primary: true, disabled: pending || detailSkill.readOnly || !policyDirty || instructionDirty || resourceDirty, onClick: savePolicy, children: t("savePolicy") })
    ] })
  ] });
  const renderDetail = () => detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dss-detail", role: "region", "aria-label": detailSkill.name, tabIndex: -1, ref: detailRef, onKeyDown: (event) => {
    if (event.key === "Escape" && !dialog) {
      event.stopPropagation();
      closeDetail();
    }
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "dss-detailheader", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-detailtop", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "arrow", disabled: pending, onClick: closeDetail, children: t("backToList") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dss-detailkind", children: [
          rootLabel(detailSkill, t, workspaceLabel),
          detailSkill.readOnly && ` \xB7 ${t("readOnly")}`
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "close", disabled: pending, onClick: closeDetail, children: t("closeDetail") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: detailSkill.name }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: detailSkill.description || "\u2014" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-tabs", role: "tablist", "aria-label": t("details"), children: ["overview", "edit", "files", "diagnostics"].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", role: "tab", className: "dss-tab", "aria-selected": tab === key, "data-active": tab === key, id: `dss-tab-${key}`, "aria-controls": `dss-panel-${key}`, onClick: () => setTab(key), children: [
      t(key),
      key === "diagnostics" && liveIssues.length ? ` \xB7 ${liveIssues.length}` : ""
    ] }, key)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-detailbody", role: "tabpanel", id: `dss-panel-${tab}`, "aria-labelledby": `dss-tab-${tab}`, children: [
      externalChanged && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-externalchange", role: "status", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("externalChange") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "refresh", disabled: pending, onClick: () => {
          if (discard()) run(() => call("read", { id: detailSkill.id }), t("reloaded"), setDetailState);
        }, children: t("reloadSkill") })
      ] }),
      tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dss-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-sectiontitle", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t("stateOverview") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Help, { label: t("stateOverview"), children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("stateLayersHint") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("duplicateHint") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("historyContextHint") })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-statelayers", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(providerOnly ? "source" : "diskState") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { className: !detailSkill.enabled ? "dss-dim" : "", children: providerOnly ? t("providerProvided") : detailSkill.enabled ? t("fileEnabled") : t("fileDisabled") }),
              !detailSkill.readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { disabled: pending, onClick: () => toggle(detailSkill, !detailSkill.enabled), children: t(detailSkill.enabled ? "disableFile" : "enableFile") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("diskState"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("fileEnableHelp") }) })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("runtimeState") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: runtimeLabel(detailSkill) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("runtimeState"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("runtimeStateHint") }) })
            ] })
          ] }),
          detailSkill.shadowedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-inlinewarning", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "alert", size: 14 }),
            t("shadowedHint")
          ] }),
          detailSkill.availability?.winnerPath && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { className: "dss-advanced", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: t("effectiveSource") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: detailSkill.availability.winnerPath })
          ] }),
          detailSkill.valid === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-inlinewarning", children: t("runtimeInvalid") })
        ] }),
        renderPolicy(),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dss-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-sectiontitle", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t("instructionPreview") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "code", disabled: pending || detailSkill.readOnly, onClick: () => setTab("edit"), children: t("editInstructions") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillMarkdown, { text: detail.text })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dss-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-sectiontitle", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t("source") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("source"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("sourceOrderHint") }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-sourceinfo", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rootLabel(roots.find((item) => item.id === detailSkill.rootId) || detailSkill, t, workspaceLabel) }),
            detailSkill.sourceInfo?.repository && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: detailSkill.sourceInfo.repository }),
            detailSkill.sourceInfo?.commit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: detailSkill.sourceInfo.commit.slice(0, 12) })
          ] }),
          detailSkill.sourceInfo?.modified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-inlinewarning", children: t("localModified") }),
          providerOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-provider", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "lock", size: 14 }),
            t("providerHint")
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "copy", disabled: pending, onClick: () => {
              if (!discard()) return;
              setDetailState(detail);
              setDialog("copy");
            }, children: t("copySkill") }),
            detailSkill.sourceInfo?.type === "github" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "refresh", disabled: pending || detailSkill.readOnly, onClick: checkUpdate, children: t("update") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "download", disabled: pending, onClick: () => exportSkills([detailSkill.id]), children: t("export") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-locationhelp", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("advancedPath") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("advancedPath"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: detailSkill.path || "\u2014" }) })
          ] })
        ] })
      ] }),
      tab === "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-contentpad", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-sectiontitle", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t("editInstructions") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("editInstructions"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("editingHint") }) })
        ] }),
        detailSkill.readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-provider", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "lock", size: 14 }),
          t("readOnly")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { spellCheck: false, className: "dss-editor dss-code", value: editor, readOnly: detailSkill.readOnly, disabled: pending || policyDirty || resourceDirty, onChange: (event) => setEditor(event.target.value), "aria-label": t("editorLabel") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-editorstatus", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("markdown") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: instructionDirty ? "dss-unsaved" : "", children: instructionDirty ? t("unsaved") : `${new TextEncoder().encode(editor).length.toLocaleString()} ${t("bytes")}` })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-editsave", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { disabled: pending || !instructionDirty, onClick: () => {
            if (window.confirm(t("discardConfirm"))) setEditor(detail.text || "");
          }, children: t("discardEdits") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { primary: true, disabled: pending || detailSkill.readOnly || !instructionDirty || policyDirty || resourceDirty, onClick: saveInstructions, children: pending ? t("working") : t("save") })
        ] })
      ] }),
      tab === "files" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-contentpad", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-sectiontitle", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
            detail.files?.length || 0,
            " ",
            t("fileCount")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("files"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: providerOnly ? t("providerHint") : t("resourceHint") }) })
        ] }),
        !detailSkill.readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-resourceadd", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "dss-input", "aria-label": t("resourcePath"), placeholder: t("resourcePathHint"), value: newResourcePath, disabled: pending, onChange: (event) => setNewResourcePath(event.target.value) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "plus", disabled: pending || !newResourcePath.trim() || dirty, onClick: () => run(async () => {
            if (!newResourcePath.trim()) throw new Error(t("invalidResource"));
            return call("saveFile", { id: detailSkill.id, path: newResourcePath.trim(), base64: "", expectedHash: detail.hash });
          }, t("resourceSaved"), async (result) => {
            const file = result.files.find((item) => item.path === newResourcePath.trim());
            setDetail(result);
            setNewResourcePath("");
            if (file) {
              setResource(file);
              setResourceText(decodeFile(file.base64) || "");
            }
            await refreshAfterChange();
          }), children: t("addResource") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "upload", disabled: pending || dirty, onClick: () => resourceInput.current?.click(), children: t("uploadResource") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "file", hidden: true, ref: resourceInput, onChange: (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            const path = newResourcePath.trim() || file.name;
            if (detail.files.some((item) => item.path === path) && !window.confirm(t("replaceResourceConfirm"))) return;
            run(async () => call("saveFile", { id: detailSkill.id, path, base64: await encodeFile(file), expectedHash: detail.hash }), t("resourceSaved"), async (result) => {
              setDetail(result);
              setNewResourcePath("");
              const chosen = result.files.find((item) => item.path === path);
              if (chosen) chooseResource(chosen);
              await refreshAfterChange();
            });
          } })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-filelist", children: detail.files?.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dss-filerow", title: file.path, onClick: () => chooseResource(file), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "file", size: 14 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: file.path }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
            (file.size ?? Math.floor((file.base64?.length || 0) * 0.75)).toLocaleString(),
            " B"
          ] })
        ] }, file.path)) }),
        resource && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-filechosen", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: resource.path }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-back", onClick: () => {
              if (resourceDirty && !window.confirm(t("resourceUnsaved"))) return;
              setResource(null);
            }, children: t("close") })
          ] }),
          decodeFile(resource.base64) === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "dss-filepreview dss-code", children: t("fileBinary") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { className: "dss-editor dss-code", "aria-label": t("resourceLabel"), style: { minHeight: 250, marginTop: 12 }, value: resourceText, readOnly: detailSkill.readOnly || /^SKILL\.md(?:\.disabled)?$/.test(resource.path), disabled: pending, onChange: (event) => setResourceText(event.target.value), spellCheck: false }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-actions", style: { justifyContent: "space-between", marginTop: 10 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { danger: true, icon: "trash", disabled: pending || detailSkill.readOnly || /^SKILL\.md(?:\.disabled)?$/.test(resource.path) || editor !== detail.text, onClick: () => {
                if (!window.confirm(t("removeResourceConfirm"))) return;
                run(() => call("deleteFile", { id: detailSkill.id, path: resource.path, expectedHash: detail.hash }), t("resourceRemoved"), async (result) => {
                  setDetail(result);
                  setResource(null);
                  await refreshAfterChange();
                });
              }, children: t("removeResource") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { primary: true, disabled: pending || detailSkill.readOnly || !resourceDirty || /^SKILL\.md(?:\.disabled)?$/.test(resource.path) || editor !== detail.text, onClick: () => run(() => call("saveFile", { id: detailSkill.id, path: resource.path, base64: encodeText(resourceText), expectedHash: detail.hash }), t("resourceSaved"), async (result) => {
                const chosen = result.files.find((file) => file.path === resource.path);
                setDetail(result);
                setResource(chosen || null);
                setResourceText(chosen ? decodeFile(chosen.base64) || "" : "");
                await refreshAfterChange();
              }), children: t("saveResource") })
            ] })
          ] })
        ] })
      ] }),
      "      ",
      tab === "diagnostics" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-contentpad", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueList, { issues: liveIssues, t }),
        detailSkill.shadowedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-issue", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("shadowed") }),
          t("shadowedHint")
        ] }),
        !invocation.model && !invocation.user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-issue", children: t("neitherHint") })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { className: "dss-detailfooter", children: [
      notice?.error && notice.skillId === detailSkill.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-detailerror", children: displayNotice(true) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "close", disabled: pending, onClick: closeDetail, children: t("closeDetail") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: dirty ? "dss-unsaved" : "dss-dim", children: dirty ? t("unsaved") : t("readMode") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { danger: true, icon: "trash", disabled: pending || detailSkill.readOnly, onClick: () => {
        if (window.confirm(t("deleteConfirm"))) run(() => call("delete", { id: detailSkill.id }), t("removed"), async () => {
          setDetail(null);
          await refreshAfterChange();
        });
      }, children: t("delete") })
    ] })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss", "aria-busy": pending, "data-has-detail": !!detail, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "dss-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-headrow", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-titlewrap", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-iconbtn", "aria-label": t("back"), onClick: () => {
            if (discard()) back?.();
          }, disabled: pending, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "arrow", size: 18 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-logo", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "spark", size: 20 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: t("title") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dss-version", children: [
            "v",
            version
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dss-brand", children: "IT\u5496\u5561\u9986 X \u8001\u9648\u804AAI" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-contextbar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dss-contextfield", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("targetWorkspace") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "dss-select", value: workspaceId, disabled: pending, onChange: (event) => changeContext("workspace", event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: "current", children: [
              currentWorkspaceLabel || t("personalSkills"),
              hasSession && currentWorkspaceLabel ? t("currentSuffix") : ""
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "user", children: t("globalOnly") }),
            contexts?.workspaces?.filter((item) => item.id !== "user").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: item.id, children: item.label || item.id }, item.id))
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dss-contextfield", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("targetPreset") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "dss-select", value: presetId, disabled: pending, onChange: (event) => changeContext("preset", event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: "current", children: [
              modeLabel,
              t(hasSession ? "currentSuffix" : "defaultSuffix")
            ] }),
            contexts?.presets?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: item.id, children: [
              presetDisplayName(item, t),
              item.broken ? ` \xB7 ${t("brokenPreset")}` : ""
            ] }, item.id))
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("targetContext"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("contextHint") }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-headeractions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "history", disabled: pending, onClick: () => run(() => call("history"), null, (result) => {
            setHistory(result.entries || []);
            setDialog("history");
          }), children: t("history") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "upload", disabled: pending || !writableRoots.length, onClick: () => openDialog("import"), children: t("import") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "plus", primary: true, disabled: pending || !writableRoots.length, onClick: () => openDialog("create"), children: t("newSkill") })
        ] })
      ] })
    ] }),
    !dialog && notice && !(notice.error && notice.skillId === detail?.skill?.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-noticearea", children: displayNotice() }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-scopebar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-scopetabs", role: "tablist", "aria-label": t("modeViewLabel"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", role: "tab", "aria-selected": !libraryMode, disabled: pending, onClick: () => changeCollectionView("mode"), children: [
          t("currentModeView"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dss-tabcount", children: catalogCount("available") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", role: "tab", "aria-selected": libraryMode, disabled: pending, onClick: () => changeCollectionView("library"), children: [
          t("libraryView"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dss-tabcount", children: skills.length })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t(libraryMode ? "libraryView" : "currentModeView"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t(libraryMode ? "libraryViewHelp" : "modeViewHelp") }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { className: "dss-sidebar", "aria-label": t("sources"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-sidehead", children: t("sources") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dss-rootbtn", "data-active": scope === "all" && root === "all", onClick: () => {
          setSelection(/* @__PURE__ */ new Set());
          setScope("all");
          setRoot("all");
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "grid", size: 15 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(libraryMode ? "libraryView" : "allSkills") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: !libraryMode && !catalogComplete ? "\u2014" : viewSkills.length })
        ] }),
        ["global", "workspace", "provided", "custom"].map((group) => {
          const groupRoots = roots.filter((item) => scopeOf(item.source) === group && (libraryMode || viewSkills.some((skill) => skill.rootId === item.id)));
          if (!groupRoots.length) return null;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-sourcegroup", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dss-rootbtn dss-grouproot", "data-active": scope === group && root === "all", onClick: () => {
              setSelection(/* @__PURE__ */ new Set());
              setScope(group);
              setRoot("all");
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: group === "provided" ? "lock" : "folder", size: 15 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { title: group === "workspace" ? workspaceLabel : void 0, children: group === "workspace" ? workspaceLabel || t("scope_workspace") : t(`scope_${group}`) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: viewSkills.filter((skill) => scopeOf(skill.source) === group).length })
            ] }),
            (group === "provided" && groupRoots.length === 1 ? [] : groupRoots).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dss-rootbtn dss-subroot", "data-active": root === item.id, onClick: () => {
              setSelection(/* @__PURE__ */ new Set());
              setScope(group);
              setRoot(item.id);
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(item.source).includes("agents") ? t("sharedSkills") : String(item.source).includes("dsh") ? t("dshSkills") : item.label || sourceLabel(item.source, t) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: viewSkills.filter((skill) => skill.rootId === item.id).length })
            ] }, item.id))
          ] }, group);
        }),
        libraryMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-locationhelp dss-rootpaths", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("advancedPath") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("advancedPath"), children: roots.filter((item) => item.path).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: rootLabel(item, t, workspaceLabel) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: item.path })
          ] }, item.id)) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-workarea", "data-split": !!detail, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { className: "dss-main", "aria-label": t("skillsList"), children: [
          !libraryMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-modecounts", "aria-label": t("modeSummary"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", "aria-pressed": invocationFilter === "all", disabled: pending, onClick: () => changeInvocationFilter("all"), children: [
              t("modeSummary"),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: catalogCount("available") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", "aria-pressed": invocationFilter === "automatic", disabled: pending, onClick: () => changeInvocationFilter("automatic"), children: [
              t("automaticFilter"),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: catalogCount("automatic") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", "aria-pressed": invocationFilter === "manual", disabled: pending, onClick: () => changeInvocationFilter("manual"), children: [
              t("manualFilter"),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: catalogCount("manual") })
            ] })
          ] }),
          !libraryMode && !loading && !catalogComplete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-catalogstatus", role: "status", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "alert", size: 16 }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: t("catalogUnknown") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("catalogConfirmedHint") })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-toolbar", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-search", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "search", size: 16 }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "dss-input", value: query, onChange: (event) => setQuery(event.target.value), placeholder: t("search"), "aria-label": t("search") })
            ] }),
            libraryMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "dss-select", value: status, onChange: (event) => {
                setSelection(/* @__PURE__ */ new Set());
                setStatus(event.target.value);
              }, "aria-label": t("allStates"), children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "all", children: t("allStates") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "enabled", children: t("fileEnabled") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "disabled", children: t("fileDisabled") })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dss-check", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: issuesOnly, onChange: (event) => {
                  setSelection(/* @__PURE__ */ new Set());
                  setIssuesOnly(event.target.checked);
                } }),
                t("issuesOnly")
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-iconbtn", "aria-label": t("refresh"), disabled: pending, onClick: () => run(() => refresh(true)), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "refresh" }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-listhead", children: [
            libraryMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dss-check", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: allVisibleSelected, disabled: !selectableVisible.length, onChange: () => setSelection(allVisibleSelected ? /* @__PURE__ */ new Set() : new Set(selectableVisible.map((skill) => skill.id))), "aria-label": t("selectAll") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: visible.length }),
              " ",
              t("skillsCount")
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              !catalogComplete && `${t("confirmedSkills")} `,
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: visible.length }),
              " ",
              t("skillsCount")
            ] }),
            libraryMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dss-listsummary", children: [
                viewSkills.filter((skill) => !skill.readOnly && !skill.enabled).length,
                " ",
                t("fileDisabled")
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("diskState"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("fileEnableHelp") }) })
            ] }),
            hasFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-back", onClick: resetFilters, children: t("resetFilters") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-viewtoggle", role: "group", "aria-label": t("layout"), children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", "aria-label": t("listView"), "aria-pressed": view === "list", onClick: () => setView("list"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "list", size: 14 }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", "aria-label": t("cardView"), "aria-pressed": view === "cards", onClick: () => setView("cards"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "grid", size: 14 }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-iconbtn", "aria-label": t("export"), disabled: pending || !exportableVisible.length, onClick: () => exportSkills(exportableVisible.map((skill) => skill.id)), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "download", size: 16 }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-scroll", children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-loading", role: "status", children: t("loading") }) : !visible.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { title: !libraryMode && !catalogComplete ? t("runtimeUnknown") : hasFilters ? t("noResults") : t(libraryMode ? "libraryEmpty" : "modeEmpty"), hint: !libraryMode && !catalogComplete ? t("catalogConfirmedHint") : hasFilters ? t("noResultsHint") : t(libraryMode ? "noSkillsHint" : "modeEmptyHint") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: view === "cards" ? "dss-grid" : "dss-list", children: visible.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: `dss-skillrow ${view === "cards" ? "dss-card" : ""}`, "data-skill-id": skill.id, "data-current": detail?.skill.id === skill.id, "data-selected": selection.has(skill.id), "data-disabled": libraryMode && !skill.enabled, children: [
            libraryMode && !skill.readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "dss-rowcheck", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: selection.has(skill.id), onChange: () => select(skill.id), "aria-label": `${skill.name} \xB7 ${t("selected")}` }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dss-rowcontent", onClick: () => openSkill(skill), disabled: pending, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dss-rowtitle", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: skill.name }),
                skill.readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "lock", size: 12 }),
                libraryMode && skill.shadowedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dss-badge dss-badge-warn", children: t("shadowedShort") }),
                !!skill.issues?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dss-badge dss-badge-warn", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "alert", size: 10 }),
                  skill.issues.length
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dss-rowdescription", children: skill.description || "\u2014" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dss-rowmeta", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rootLabel(roots.find((item) => item.id === skill.rootId) || skill, t, workspaceLabel) }),
                libraryMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dss-runtimestate", children: runtimeLabel(skill) }),
                (!libraryMode || availableIds.has(skill.id)) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dss-invocation", children: [
                  automaticIds.has(skill.id) ? t("automaticFilter") : "",
                  automaticIds.has(skill.id) && manualIds.has(skill.id) ? " \xB7 " : "",
                  manualIds.has(skill.id) ? t("manualFilter") : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-rowstate", children: libraryMode && !skill.readOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(skill.enabled ? "fileEnabled" : "fileDisabled") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-switch", role: "switch", "aria-checked": !!skill.enabled, "aria-label": `${skill.name} \xB7 ${t(skill.enabled ? "disableFile" : "enableFile")}`, "data-on": !!skill.enabled, disabled: pending, onClick: () => toggle(skill, !skill.enabled) })
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: skill.readOnly ? "dss-provided" : "dss-modeavailable", children: skill.readOnly ? String(skill.id).startsWith("provider:") ? t("providerProvided") : t("readOnly") : t("availableInMode") }) })
          ] }, skill.id)) }) }),
          libraryMode && selectedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-bulk", role: "toolbar", "aria-label": t("selected"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              selectedCount,
              " ",
              t("selected")
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { disabled: pending || dirty || activeSelectedIds.every((id) => skills.find((skill) => skill.id === id)?.enabled), onClick: () => bulkToggle(true), children: t("enableSelected") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { disabled: pending || dirty || activeSelectedIds.every((id) => !skills.find((skill) => skill.id === id)?.enabled), onClick: () => bulkToggle(false), children: t("disableSelected") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "download", disabled: pending, onClick: () => exportSkills(activeSelectedIds), children: t("exportSelected") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-iconbtn", "aria-label": t("clearSelection"), onClick: () => setSelection(/* @__PURE__ */ new Set()), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "close", size: 15 }) })
          ] })
        ] }),
        renderDetail()
      ] })
    ] }),
    dialog === "create" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, { title: t("createTitle"), hint: t("createHint"), close: closeDialog, busy: pending, t, footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { onClick: closeDialog, disabled: pending, children: t("cancel") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { primary: true, icon: pending ? "refresh" : "plus", disabled: pending || !targetRoot, onClick: createSkill, children: pending ? t("working") : t("create") })
    ] }), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      displayNotice(),
      rootSelect,
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dss-field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("name") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "dss-input", value: newName, disabled: pending, onChange: (event) => setNewName(event.target.value), placeholder: t("namePlaceholder"), autoComplete: "off" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("name"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("nameHint") }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dss-field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("description") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { className: "dss-textarea", value: newDescription, disabled: pending, onChange: (event) => setNewDescription(event.target.value), placeholder: t("descriptionPlaceholder") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dss-field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("template") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { className: "dss-select", value: template, disabled: pending, onChange: (event) => setTemplate(event.target.value), children: ["General", "Research", "Writing", "Code"].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: key, children: t(`template${key}`) }, key)) })
      ] })
    ] }) }),
    dialog === "import" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, { title: t("importTitle"), hint: t("importHint"), close: closeDialog, busy: pending, t, tabs: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-tabs", role: "tablist", "aria-label": t("source"), children: ["github", "localFiles"].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-tab", role: "tab", "aria-selected": importMode === mode, "data-active": importMode === mode, disabled: pending, onClick: () => {
      setImportMode(mode);
      setPreview(null);
    }, children: t(mode) }, mode)) }), footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { onClick: closeDialog, disabled: pending, children: t("cancel") }),
      preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { primary: true, icon: "check", disabled: pending || !preview.skills?.some((skill) => !skill.conflict && !skill.issues?.some((issue) => issue.severity === "error")), onClick: () => run(() => call("applyImport", { token: preview.token }), t("imported"), async (result) => {
        await refreshAfterChange();
        if (result.skipped?.length) throw new Error(`${t("savedPartial")}
${result.skipped.map((item) => `${item.name}: ${item.reason}`).join("\n")}`);
        setDialog(null);
        setCollectionView("library");
        resetFilters();
        setPreview(null);
        setUploads([]);
      }), children: pending ? t("working") : t("importNow") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { primary: true, icon: pending ? "refresh" : "search", disabled: pending || !targetRoot, onClick: importPreview, children: pending ? t("working") : t("preview") })
    ] }), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      displayNotice(),
      rootSelect,
      importMode === "github" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dss-field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("githubUrl") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "dss-input", type: "url", value: githubUrl, disabled: pending, onChange: (event) => {
          setGithubUrl(event.target.value);
          setPreview(null);
        }, placeholder: t("githubPlaceholder") })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-dropzone", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "upload", size: 26 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("localFiles"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("localHint") }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "file", disabled: pending, onClick: () => fileInput.current?.click(), children: t("uploadFiles") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "folder", disabled: pending, onClick: () => folderInput.current?.click(), children: t("uploadFolder") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "file", hidden: true, multiple: true, accept: ".md,.zip", ref: fileInput, onChange: (event) => {
            localFiles(event.target.files);
            event.target.value = "";
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "file", hidden: true, multiple: true, webkitdirectory: "", directory: "", ref: folderInput, onChange: (event) => {
            localFiles(event.target.files);
            event.target.value = "";
          } })
        ] }),
        uploads.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-filechosen", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            uploads.length,
            " ",
            t("filesChosen")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dss-back", disabled: pending, onClick: () => {
            setUploads([]);
            setPreview(null);
          }, children: t("clearFiles") })
        ] })
      ] }),
      preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dss-preview", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t("previewTitle") }),
        (preview.commit || preview.source?.commit) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-commit", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("commit") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: preview.commit || preview.source?.commit }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("commit"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("previewCommitHint") }) })
        ] }),
        !preview.skills?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dss-note", children: t("importNoReady") }),
        preview.skills?.map((skill, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-previewrow", "data-conflict": !!skill.conflict, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: skill.conflict || skill.issues?.length ? "alert" : "check", size: 18 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: skill.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: skill.description }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-badges", style: { marginTop: 7 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `dss-badge ${skill.conflict ? "dss-badge-warn" : "dss-badge-blue"}`, children: skill.conflict ? t("conflict") : t("ready") }) }),
            skill.conflict && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dss-inlinewarning", children: t("conflictHint") }),
            skill.issues?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueList, { issues: skill.issues, t }) }),
            skill.text && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { className: "dss-previewdetails", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: t("markdown") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "dss-filepreview dss-code", children: skill.text })
            ] }),
            skill.files?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { className: "dss-previewdetails", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [
                t("files"),
                " \xB7 ",
                skill.files.length
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-filelist", style: { marginTop: 10 }, children: skill.files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-filerow", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "file", size: 12 }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: file.path }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
                  file.size,
                  " B"
                ] })
              ] }, file.path)) })
            ] })
          ] })
        ] }, `${skill.name}-${index}`))
      ] })
    ] }) }),
    dialog === "copy" && detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, { title: t("copyTitle"), hint: t("copyHint"), close: closeDialog, busy: pending, t, footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { onClick: closeDialog, disabled: pending, children: t("cancel") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { primary: true, icon: "copy", disabled: pending || !targetRoot, onClick: () => run(() => call("copy", { id: detailSkill.id, rootId: targetRoot }), t("skillCopied"), async () => {
        setDialog(null);
        setCollectionView("library");
        resetFilters();
        setDetail(null);
        await refreshAfterChange();
      }), children: pending ? t("working") : t("copy") })
    ] }), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      displayNotice(),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dss-note", children: detailSkill.name }),
      rootSelect
    ] }) }),
    dialog === "update" && preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, { drawer: true, title: t("updateTitle"), hint: t("updateHint"), close: closeDialog, busy: pending, t, footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { onClick: closeDialog, disabled: pending, children: t("cancel") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { primary: true, icon: "check", disabled: pending || preview.skills?.some((skill) => skill.conflict || skill.issues?.some((issue) => issue.severity === "error")) || !preview.localModified && preview.changes?.every((change) => change.status === "unchanged"), onClick: () => run(() => call("applyImport", { token: preview.token }), t("updated"), async (result) => {
        if (result.skipped?.length) throw new Error(result.skipped.map((item) => `${item.name}: ${item.reason}`).join("\n"));
        setDialog(null);
        setDetail(null);
        setPreview(null);
        await refreshAfterChange();
      }), children: pending ? t("working") : t("updateApply") })
    ] }), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-contentpad", children: [
      displayNotice(),
      preview.localModified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-banner dss-banner-error", role: "alert", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "alert", size: 17 }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t("localModified") })
      ] }),
      preview.unchanged && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-banner", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check", size: 17 }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t("unchanged") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-commit", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("previousCommit") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: preview.previousCommit || "\u2014" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("incomingCommit") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: preview.source?.commit || preview.commit || "\u2014" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { fontSize: 13, marginBottom: 10 }, children: t("reviewFiles") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, { label: t("reviewFiles"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("updateOverview") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-filelist", children: [
        preview.changes?.filter((change) => change.status !== "unchanged").map((change) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-filerow", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "file", size: 14 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: change.path }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dss-badge", style: { flex: "none" }, children: t(`change_${change.status}`) })
        ] }, change.path)),
        preview.changes?.every((change) => change.status === "unchanged") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dss-note", children: t("noChanges") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-diff", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t("currentVersion") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "dss-filepreview dss-code", children: preview.currentText })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t("incomingVersion") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "dss-filepreview dss-code", children: preview.incomingText })
        ] })
      ] }),
      preview.skills?.map((skill, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueList, { issues: skill.issues, t }) }, index))
    ] }) }),
    dialog === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, { title: t("history"), hint: t("historyHint"), close: closeDialog, busy: pending, t, footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { onClick: closeDialog, disabled: pending, children: t("close") }), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      displayNotice(),
      !history.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { title: t("noHistory"), hint: t("noHistoryHint"), icon: "history" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dss-historylist", children: history.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dss-historyrow", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "history", size: 18 }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: entry.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
            t(`action_${entry.action}`) === `action_${entry.action}` ? entry.action : t(`action_${entry.action}`),
            " \xB7 ",
            (() => {
              const date = new Date(entry.date);
              return Number.isNaN(date.valueOf()) ? String(entry.date) : date.toLocaleString(t("dateLocale"));
            })()
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { icon: "history", disabled: pending, onClick: () => {
          if (window.confirm(t("restoreConfirm"))) run(() => call("restore", { historyId: entry.id }), t("restored"), async (restored) => {
            if (restored?.skill?.id === detail?.skill?.id) setDetailState(restored);
            const result = await call("history");
            setHistory(result.entries || []);
            await refreshAfterChange();
          });
        }, children: t("restore") })
      ] }, entry.id)) })
    ] }) })
  ] });
}

// src/style.css
var style_default = `.dss {
  --dss-bg:var(--dsw-alias-bg-layer-1,#fff);
  --dss-soft:var(--dsw-alias-bg-layer-2,#f7f8fa);
  --dss-raised:var(--dsw-alias-bg-layer-3,#fff);
  --dss-text:var(--dsw-alias-label-primary,#18212f);
  --dss-muted:var(--dsw-alias-label-secondary,#606b7b);
  --dss-faint:var(--dsw-alias-label-tertiary,#8c95a3);
  --dss-line:var(--dsw-alias-border-l2,#e8ebf0);
  --dss-blue:var(--dsw-alias-state-business-primary,#4d6bfe);
  --dss-red:var(--dsw-alias-state-error-primary,#d94b58);
  --dss-green:var(--dsw-alias-state-success-primary,#27916d);
  position:relative;isolation:isolate;container-type:inline-size;
  display:flex;flex-direction:column;height:100%;min-height:0;min-width:0;overflow:hidden;
  box-sizing:border-box;color:var(--dss-text);background:var(--dss-bg);
  font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",sans-serif;text-align:left;
}
.dss *{box-sizing:border-box}
.dss button,.dss input,.dss select,.dss textarea{font:inherit}
.dss button{cursor:pointer;transition:background .15s,color .15s}
.dss button:disabled{cursor:not-allowed;opacity:.48}
.dss button:focus-visible,.dss input:focus-visible,.dss select:focus-visible,.dss textarea:focus-visible,.dss [tabindex]:focus-visible,.dss summary:focus-visible{outline:2px solid var(--dss-blue);outline-offset:2px}
.dss h1,.dss h2,.dss h3,.dss p{margin:0}
.dss svg{flex:none}
.dss code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.dss-header{padding:15px 22px 13px;border-bottom:1px solid var(--dss-line);flex:none;background:var(--dss-bg);z-index:5}
.dss-headrow,.dss-titlewrap,.dss-contextbar{display:flex;align-items:center;gap:10px}
.dss-headrow{justify-content:space-between;margin-bottom:12px}
.dss-titlewrap{min-width:0}
.dss-logo{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;background:color-mix(in srgb,var(--dss-blue) 9%,transparent);color:var(--dss-blue)}
.dss h1{font-size:19px;line-height:1.35;font-weight:650;letter-spacing:-.4px;white-space:nowrap}
.dss-version{font-size:12px;color:var(--dss-faint);padding:2px 5px;background:var(--dss-soft);border-radius:4px}
.dss-brand{font-size:12px;color:var(--dss-muted);white-space:nowrap;letter-spacing:.01em}
.dss-contextbar{gap:12px;flex-wrap:wrap}
.dss-contextfield{display:flex;align-items:center;gap:7px;min-width:0}
.dss-contextfield>span{font-size:12px;color:var(--dss-muted);white-space:nowrap}
.dss-contextfield .dss-select{max-width:225px;min-width:130px;padding:6px 26px 6px 9px;min-height:32px;font-size:11px}
.dss-headeractions{margin-left:auto;display:flex;align-items:center;gap:7px}
.dss-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.dss-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;padding:6px 10px;border-radius:7px;border:1px solid var(--dss-line);background:var(--dss-bg);color:var(--dss-text);font-size:12px!important;white-space:nowrap}
.dss-btn:hover:not(:disabled){background:var(--dss-soft)}
.dss-btn-primary{background:var(--dss-blue);border-color:var(--dss-blue);color:#fff}
.dss-btn-primary:hover:not(:disabled){background:color-mix(in srgb,var(--dss-blue) 88%,#000)}
.dss-btn-danger{color:var(--dss-red)}
.dss-iconbtn{width:30px;height:30px;padding:0;border:0;background:transparent;color:var(--dss-muted);border-radius:6px;display:inline-flex;align-items:center;justify-content:center;flex:none}
.dss-iconbtn:hover:not(:disabled){background:var(--dss-soft)}
.dss-back{display:flex;align-items:center;gap:5px;padding:0;border:0;background:transparent;color:var(--dss-blue);font-size:12px!important;white-space:nowrap}
.dss-noticearea{padding:10px 22px 0;flex:none}
.dss-noticearea .dss-banner{margin:0 0 10px}
.dss-body{display:flex;min-height:0;flex:1;min-width:0}
.dss-sidebar{width:184px;flex:none;padding:16px 10px;background:var(--dss-soft);border-right:1px solid var(--dss-line);overflow:auto}
.dss-sidehead{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:600;letter-spacing:.03em;color:var(--dss-faint);padding:0 9px 9px}
.dss-rootbtn{width:100%;display:flex;align-items:center;gap:8px;padding:8px 9px;border:0;border-radius:7px;background:transparent;color:var(--dss-muted);text-align:left;font-size:12px!important;min-height:33px}
.dss-rootbtn:hover{background:var(--dss-bg)}
.dss-rootbtn[data-active=true]{background:color-mix(in srgb,var(--dss-blue) 9%,var(--dss-bg));color:var(--dss-blue)}
.dss-rootbtn span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dss-rootbtn small{margin-left:auto;color:var(--dss-faint);font-size:12px;font-variant-numeric:tabular-nums}
.dss-sourcegroup{margin-top:9px}
.dss-grouproot{font-weight:550!important}
.dss-subroot{padding-left:32px;font-size:12px!important;min-height:29px}
.dss-workarea{display:flex;min-width:0;min-height:0;flex:1}
.dss-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;padding:14px 18px 0}
.dss-toolbar{display:flex;align-items:center;gap:8px;flex:none;margin-bottom:8px;flex-wrap:wrap}
.dss-search{position:relative;flex:1;min-width:140px}
.dss-search>svg{position:absolute;left:10px;top:10px;color:var(--dss-faint)}
.dss-input,.dss-select,.dss-textarea{width:100%;border:1px solid var(--dss-line);background:var(--dss-bg);border-radius:7px;color:var(--dss-text);padding:8px 10px;min-height:34px;font-size:12px!important}
.dss-input::placeholder,.dss-textarea::placeholder{color:var(--dss-faint)}
.dss-search input{padding-left:33px}
.dss-select{width:auto;max-width:240px}
.dss-check{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--dss-muted);white-space:nowrap;cursor:pointer}
.dss input[type=checkbox]{accent-color:var(--dss-blue);width:14px;height:14px;margin:0;cursor:pointer;flex:none}
.dss-listhead{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--dss-faint);padding:2px 0 8px;min-height:34px;flex:none}
.dss-listhead strong{font-weight:500;color:var(--dss-muted)}
.dss-listsummary{color:var(--dss-faint);white-space:nowrap}
.dss-viewtoggle{display:flex;align-items:center;margin-left:auto;border:1px solid var(--dss-line);border-radius:6px;padding:2px;flex:none}
.dss-viewtoggle button{display:flex;align-items:center;justify-content:center;width:25px;height:22px;border:0;background:transparent;color:var(--dss-faint);border-radius:4px}
.dss-viewtoggle button[aria-pressed=true]{color:var(--dss-blue);background:color-mix(in srgb,var(--dss-blue) 8%,var(--dss-bg))}
.dss-scroll{flex:1;min-height:0;overflow:auto;padding:1px 1px 20px;scrollbar-gutter:stable}
.dss-list{border:1px solid var(--dss-line);border-radius:9px;overflow:hidden}
.dss-skillrow{display:flex;align-items:center;gap:11px;padding:12px 13px;border-bottom:1px solid var(--dss-line);background:var(--dss-bg);min-width:0}
.dss-skillrow:last-child{border-bottom:0}
.dss-skillrow:hover{background:color-mix(in srgb,var(--dss-soft) 65%,var(--dss-bg))}
.dss-skillrow[data-current=true],.dss-skillrow[data-selected=true]{background:color-mix(in srgb,var(--dss-blue) 5%,var(--dss-bg))}
.dss-skillrow[data-current=true]{box-shadow:inset 3px 0 var(--dss-blue)}
.dss-rowcheck{display:flex;align-items:center;align-self:flex-start;padding-top:4px}
.dss-rowcontent{flex:1;min-width:0;text-align:left;padding:0;border:0;color:var(--dss-text);background:transparent;display:flex;flex-direction:column;gap:4px}
.dss-rowtitle{display:flex;align-items:center;gap:7px;min-width:0;max-width:100%}
.dss-rowtitle strong{font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dss-rowtitle>svg{color:var(--dss-faint)}
.dss-rowdescription{font-size:13px;color:var(--dss-muted);line-height:1.55;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;display:block}
.dss-rowmeta{display:flex;align-items:center;gap:9px;font-size:11px;color:var(--dss-faint);flex-wrap:wrap;line-height:1.45}
.dss-rowmeta>span+span{border-left:1px solid var(--dss-line);padding-left:9px}
.dss-runtimestate{color:var(--dss-muted)}
.dss-invocation{color:var(--dss-muted)}
.dss-rowstate{display:flex;align-items:center;gap:9px;font-size:12px;color:var(--dss-muted);align-self:flex-start;padding-top:3px;flex:none}
.dss-skillrow[data-disabled=true] .dss-rowtitle strong{color:var(--dss-muted)}
.dss-skillrow[data-disabled=true] .dss-rowstate{color:var(--dss-faint)}
.dss-badges{display:flex;gap:5px;flex-wrap:wrap;min-width:0}
.dss-badge{display:inline-flex;align-items:center;gap:4px;font-size:12px;padding:2px 5px;background:var(--dss-soft);color:var(--dss-muted);border-radius:4px;white-space:nowrap;flex:none}
.dss-badge-warn{background:color-mix(in srgb,#c88b23 10%,transparent);color:#a87923}
.dss-badge-blue{background:color-mix(in srgb,var(--dss-blue) 8%,transparent);color:var(--dss-blue)}
.dss-switch{position:relative;flex:none;width:30px;height:18px;background:color-mix(in srgb,var(--dss-faint) 30%,var(--dss-line));border:0;border-radius:20px;padding:2px}
.dss-switch[data-on=true]{background:var(--dss-blue)}
.dss-switch::after{content:'';display:block;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 3px #0002;transition:transform .16s}
.dss-switch[data-on=true]::after{transform:translateX(12px)}
.dss-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;align-content:start}
.dss-grid .dss-card{border:1px solid var(--dss-line);border-radius:9px;align-items:flex-start;padding:13px;gap:9px;flex-wrap:wrap}
.dss-card .dss-rowdescription{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;min-height:34px}
.dss-card .dss-rowcontent{flex-basis:calc(100% - 30px)}
.dss-card .dss-rowmeta{gap:5px}
.dss-card .dss-rowmeta>span+span{border:0;padding-left:0}
.dss-card .dss-rowstate{padding-left:23px;margin-top:5px;width:100%;justify-content:space-between}
.dss-bulk{display:flex;align-items:center;gap:6px;padding:10px 0;border-top:1px solid var(--dss-line);flex:none;flex-wrap:wrap;background:var(--dss-bg)}
.dss-bulk>span{font-size:12px;color:var(--dss-muted);margin-right:auto}
.dss-banner{display:flex;align-items:flex-start;gap:9px;padding:10px 12px;border-radius:8px;margin-bottom:12px;font-size:12px;overflow-wrap:anywhere;background:color-mix(in srgb,var(--dss-blue) 7%,var(--dss-bg));color:var(--dss-blue)}
.dss-banner-error{background:color-mix(in srgb,var(--dss-red) 7%,var(--dss-bg));color:var(--dss-red)}
.dss-banner>div{flex:1;min-width:0}
.dss-banner strong{display:block;font-size:12px;margin-bottom:2px}
.dss-banner .dss-iconbtn{flex:none;width:20px;height:20px;color:inherit}
.dss-banner .dss-help{display:inline-block;margin-left:8px;vertical-align:middle}
.dss-erroractions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:flex-start}
.dss-erroractions details{flex-basis:100%;color:var(--dss-muted)}
.dss-erroractions summary{cursor:pointer;font-size:12px}
.dss-erroractions pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:120px;overflow:auto;font-size:11px;margin:8px 0 0;user-select:text}
.dss-detailerror{flex-basis:100%;width:100%}
.dss-detailerror .dss-banner{margin:0;max-height:220px;overflow:auto}
.dss-detailfooter:has(.dss-detailerror){flex-wrap:wrap}
.dss-locationhelp{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--dss-muted);margin:12px 0}
.dss-locationhelp code{display:block;overflow-wrap:anywhere;white-space:normal;font-size:11px;margin-top:5px;font-weight:400}
.dss-locationhelp .dss-helppopover>div+div{margin-top:12px}
.dss-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:230px;padding:30px;gap:10px;color:var(--dss-faint)}
.dss-emptyicon{color:var(--dss-blue);width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:color-mix(in srgb,var(--dss-blue) 8%,transparent);margin-bottom:4px}
.dss-empty h3{font-size:15px;font-weight:550;color:var(--dss-text)}
.dss-empty p{font-size:12px;max-width:350px;line-height:1.8;margin-bottom:5px}
/* All dialogs are bounded by this plugin's work area, including inside desktop hosts. */
.dss-overlay{position:absolute;inset:0;background:#0f172a44;z-index:50;display:flex;align-items:center;justify-content:center;padding:18px;min-height:0}
.dss-modal{background:var(--dss-bg);border:1px solid var(--dss-line);border-radius:12px;box-shadow:0 18px 65px #0003;width:min(610px,100%);max-height:100%;display:flex;flex-direction:column;overflow:hidden;outline:none}
.dss-modal-wide{width:min(950px,100%)}
.dss-modalheader{padding:18px 20px;display:flex;gap:15px;align-items:flex-start;border-bottom:1px solid var(--dss-line);flex:none}
.dss-modalheader>div{display:flex;align-items:center;gap:8px;flex:1;min-width:0}
.dss-modalheader h2{font-size:17px;letter-spacing:-.3px;overflow-wrap:anywhere}
.dss-modalbody{padding:20px;overflow:auto;min-height:0;flex:1}
.dss-modalfooter{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid var(--dss-line);flex:none;background:var(--dss-soft);flex-wrap:wrap}
.dss-field{display:flex;flex-direction:column;gap:7px;margin-bottom:17px;position:relative}
.dss-field>span,.dss-field>label{font-size:12px;font-weight:550}
.dss-field>.dss-help{align-self:flex-start}
.dss-field .dss-select{width:100%;max-width:none}
.dss-textarea{resize:vertical;min-height:80px;line-height:1.7}
.dss-tabs{display:flex;align-items:center;gap:20px;border-bottom:1px solid var(--dss-line);padding:0 20px;flex:none;overflow-x:auto}
.dss-tab{border:0;border-bottom:2px solid transparent;padding:12px 0 10px;background:transparent;color:var(--dss-muted);font-size:12px!important;white-space:nowrap}
.dss-tab[data-active=true]{color:var(--dss-blue);border-bottom-color:var(--dss-blue)}
.dss-dropzone{padding:25px 18px;border:1px dashed var(--dss-line);border-radius:9px;background:var(--dss-soft);text-align:center}
.dss-dropzone>svg{color:var(--dss-blue);margin-bottom:9px}
.dss-dropzone>.dss-help{display:block;margin:0 auto 14px}
.dss-dropzone .dss-actions{justify-content:center}
.dss-filechosen{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--dss-muted);gap:10px;margin:12px 0;overflow-wrap:anywhere}
.dss-preview{margin-top:20px;padding-top:17px;border-top:1px solid var(--dss-line)}
.dss-preview h3{font-size:13px;margin-bottom:10px}
.dss-previewrow{display:flex;align-items:flex-start;gap:10px;border:1px solid var(--dss-line);border-radius:8px;padding:12px;margin-bottom:8px}
.dss-previewrow>div{flex:1;min-width:0}
.dss-previewrow strong{font-size:12px;overflow-wrap:anywhere}
.dss-previewrow p{font-size:12px;color:var(--dss-muted);margin-top:4px;overflow-wrap:anywhere}
.dss-previewrow>svg{color:var(--dss-blue);margin-top:2px}
.dss-previewrow[data-conflict=true]>svg{color:#a87923}
.dss-commit{display:flex;flex-direction:column;gap:4px;padding:10px 12px;background:var(--dss-soft);border-radius:7px;font-size:12px;color:var(--dss-muted);margin-bottom:12px}
.dss-commit code{font-size:12px;overflow-wrap:anywhere;color:var(--dss-text)}
.dss-detail{flex:0 0 min(58%,760px);min-width:440px;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--dss-line);background:var(--dss-bg);outline:none;box-shadow:-8px 0 24px #00000003}
.dss-detailheader{padding:12px 20px 15px;border-bottom:1px solid var(--dss-line);flex:none}
.dss-detailtop{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:13px}
.dss-detailtop .dss-btn{padding:6px 9px;font-size:12px!important;min-height:32px}
.dss-detailkind{font-size:12px;color:var(--dss-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dss-detailheader h2{font-size:20px;line-height:1.4;letter-spacing:-.3px;overflow-wrap:anywhere}
.dss-detailheader>p{font-size:13px;color:var(--dss-muted);line-height:1.65;margin-top:6px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.dss-detailbody{flex:1;min-height:0;overflow:auto;scrollbar-gutter:stable}
.dss-detailfooter{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:11px 16px;border-top:1px solid var(--dss-line);background:var(--dss-soft);flex:none}
.dss-detailfooter>span{font-size:12px;text-align:center}
.dss-section{padding:18px 20px;border-bottom:1px solid var(--dss-line)}
.dss-section:last-child{border-bottom:0}
.dss-sectiontitle{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:13px}
.dss-sectiontitle h3{font-size:12px;font-weight:600}
.dss-statelayers{display:flex;flex-direction:column;gap:10px}
.dss-statelayers>div{display:flex;align-items:center;gap:12px;min-height:28px}
.dss-statelayers>div>span{font-size:12px;color:var(--dss-faint);min-width:103px}
.dss-statelayers strong{font-size:13px;font-weight:500;flex:1}
.dss-policyrow{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:13px 0}
.dss-policyrow>div{display:flex;flex-direction:column;gap:3px}
.dss-policyrow strong{font-size:13px;font-weight:500}
.dss-policyrow span{font-size:12px;color:var(--dss-faint)}
.dss-policyactions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:15px}
.dss-policyactions>span{font-size:11px}
.dss-sourceinfo{display:flex;flex-wrap:wrap;align-items:center;gap:7px 13px;font-size:12px;color:var(--dss-muted);margin-bottom:12px;overflow-wrap:anywhere}
.dss-inlinewarning{font-size:12px;color:#a87923;display:flex;align-items:center;gap:7px;margin-top:10px;line-height:1.7}
.dss-provider{display:flex;align-items:flex-start;gap:7px;font-size:12px;color:var(--dss-muted);padding:10px 12px;border-radius:7px;background:var(--dss-soft);margin:10px 0}
.dss-provider svg{margin-top:2px}
.dss-advanced{font-size:12px;color:var(--dss-faint);margin-top:13px;min-width:0}
.dss-advanced summary{cursor:pointer;color:var(--dss-muted);padding:3px 0}
.dss-advanced code{display:block;font-size:12px;line-height:1.8;overflow-wrap:anywhere;white-space:pre-wrap;padding-top:7px;user-select:text}
.dss-rootpaths{padding:12px 9px 0;border-top:1px solid var(--dss-line);margin-top:20px}
.dss-rootpaths>div{padding:8px 0}
.dss-rootpaths strong{font-size:12px;font-weight:500}
.dss-contentpad{padding:18px 20px}
.dss-code{font:12px/1.85 ui-monospace,SFMono-Regular,Menlo,Consolas,"Noto Sans Mono",monospace;tab-size:2;overflow-wrap:anywhere}
.dss-editor{display:block;width:100%;resize:vertical;min-height:340px;padding:13px 14px;border:1px solid var(--dss-line);border-radius:8px;background:var(--dss-soft);color:var(--dss-text);outline:none}
.dss-editor:read-only{color:var(--dss-muted)}
.dss-editorstatus{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--dss-faint);margin-top:8px}
.dss-editsave{display:flex;justify-content:flex-end;gap:8px;margin-top:15px}
.dss-unsaved{color:#a87923!important}
.dss-dim{color:var(--dss-faint)!important}
.dss-note{font-size:12px;color:var(--dss-faint);line-height:1.8;margin-bottom:14px!important}
.dss-filelist{display:flex;flex-direction:column;gap:5px}
.dss-filerow{width:100%;display:flex;align-items:center;gap:9px;padding:9px 10px;border:1px solid var(--dss-line);border-radius:6px;background:var(--dss-bg);color:var(--dss-muted);text-align:left;font-size:12px!important}
button.dss-filerow:hover{background:var(--dss-soft)}
.dss-filerow span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dss-filerow small{color:var(--dss-faint);font-size:12px;flex:none}
.dss-filepreview{border:1px solid var(--dss-line);border-radius:7px;background:var(--dss-soft);padding:13px;overflow:auto;max-height:350px;margin-top:12px;white-space:pre-wrap;font-size:11px}
.dss-resourceadd{display:flex;align-items:center;gap:7px;margin-bottom:13px;flex-wrap:wrap}
.dss-resourceadd .dss-input{flex:1;min-width:160px}
.dss-issue{padding:11px 13px;border:1px solid var(--dss-line);border-left:3px solid #c88b23;border-radius:7px;margin-bottom:8px;font-size:12px;overflow-wrap:anywhere}
.dss-issue[data-severity=error]{border-left-color:var(--dss-red)}
.dss-issue strong{font-size:12px;display:block;color:var(--dss-muted);margin-bottom:4px}
.dss-checkpass{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--dss-green);padding:12px 0}
.dss-checkhelp{display:flex;justify-content:flex-end}
.dss-historylist{display:flex;flex-direction:column;gap:8px}
.dss-historyrow{border:1px solid var(--dss-line);border-radius:8px;padding:12px;display:flex;align-items:center;gap:11px}
.dss-historyrow>div{flex:1;min-width:0}
.dss-historyrow strong{display:block;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dss-historyrow p{font-size:12px;color:var(--dss-faint);margin-top:4px}
.dss-diff{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin-top:18px}
.dss-diff h3{font-size:12px}
.dss-diff pre{margin-top:8px;max-height:440px;min-height:150px;font-size:12px;line-height:1.8}
.dss-previewdetails{margin-top:10px;min-width:0}
.dss-previewdetails>summary{font-size:12px;color:var(--dss-muted);cursor:pointer}
.dss-previewdetails pre{max-height:280px;font-size:11px}
.dss-previewdetails .dss-filelist{max-height:180px;overflow:auto}
.dss-help{position:relative;display:inline-flex;align-items:center;font-weight:400;flex:none;vertical-align:middle}
.dss-helpbutton{border:1px solid color-mix(in srgb,var(--dss-faint) 65%,transparent);color:var(--dss-faint);background:transparent;border-radius:50%;width:20px;height:20px;padding:0;display:flex;align-items:center;justify-content:center;font-size:12px!important;font-weight:600;line-height:1}
.dss-helpbutton:hover,.dss-helpbutton[aria-expanded=true]{color:var(--dss-blue);border-color:var(--dss-blue);background:color-mix(in srgb,var(--dss-blue) 5%,var(--dss-bg))}
.dss-helppopover{position:absolute;right:auto;top:calc(100% + 7px);display:block;width:290px;max-width:none;overflow:auto;overscroll-behavior:contain;z-index:35;padding:12px 14px;border:1px solid var(--dss-line);border-radius:9px;box-shadow:0 8px 28px #0002;background:var(--dss-raised);color:var(--dss-muted);font-size:12px;line-height:1.8;text-align:left;white-space:normal;overflow-wrap:anywhere}
.dss-helppopover p+p{margin-top:8px}
.dss-helppopover code{font-size:12px;display:block;margin-top:7px}
.dss-markdown{font-size:13px;line-height:1.85;color:var(--dss-muted);overflow-wrap:anywhere}
.dss-markdown h1,.dss-markdown h2,.dss-markdown h3,.dss-markdown h4,.dss-markdown h5,.dss-markdown h6{color:var(--dss-text);margin:22px 0 10px;font-weight:600;line-height:1.5;white-space:normal}
.dss-markdown>:first-child{margin-top:0}
.dss-markdown h1{font-size:19px}.dss-markdown h2{font-size:16px}.dss-markdown h3{font-size:14px}.dss-markdown h4{font-size:13px}
.dss-markdown p{margin:10px 0;white-space:pre-wrap}.dss-markdown ul,.dss-markdown ol{padding-left:22px;margin:10px 0}.dss-markdown li{margin:4px 0}
.dss-markdown code{font-size:12px;background:var(--dss-soft);padding:2px 5px;border:1px solid var(--dss-line);border-radius:4px}
.dss-markdown pre{padding:13px 15px;border:1px solid var(--dss-line);border-radius:8px;background:var(--dss-soft);overflow:auto;white-space:pre-wrap;margin:12px 0;line-height:1.8}
.dss-markdown pre code{border:0;padding:0;background:transparent}
.dss-markdown blockquote{margin:12px 0;border-left:3px solid var(--dss-line);padding:3px 13px;color:var(--dss-faint);white-space:pre-wrap}
.dss-markdown hr{border:0;border-top:1px solid var(--dss-line);margin:18px 0}
.dss-markdown a{color:var(--dss-blue);text-decoration:underline;text-underline-offset:3px}
.dss-loading{display:flex;flex-direction:column;gap:7px}
.dss-skeleton{height:84px;border:1px solid var(--dss-line);border-radius:8px;background:var(--dss-soft);animation:dss-pulse 1.6s ease-in-out infinite}
@keyframes dss-pulse{50%{opacity:.45}}
@container (max-width:1200px){.dss-contextbar{gap:9px}.dss-contextfield .dss-select{max-width:170px}.dss-sidebar{width:158px}.dss-main{padding-left:13px;padding-right:13px}.dss-detail{flex-basis:56%;min-width:420px}.dss-workarea[data-split=true] .dss-rowstate>span{display:none}.dss-workarea[data-split=true] .dss-listsummary{display:none}}
@container (max-width:1000px){.dss-headeractions{margin-left:0}.dss-contextbar>.dss-help{margin-right:auto}.dss-header{padding:13px 16px}.dss-workarea[data-split=true] .dss-main{display:none}.dss-workarea[data-split=true] .dss-detail{flex:1;min-width:0;max-width:none;border-left:0}.dss-detailtop .dss-btn{font-size:12px!important}.dss-detailkind{margin-left:auto;margin-right:auto}}
@container (max-width:700px){.dss-sidebar{width:130px;padding:12px 6px}.dss-subroot{padding-left:26px}.dss-rootbtn{font-size:12px!important;padding-left:7px;padding-right:7px}.dss-brand{font-size:11px}.dss h1{font-size:17px}.dss-titlewrap{gap:7px}.dss-contextfield{flex:1;min-width:200px}.dss-contextfield .dss-select{max-width:none;flex:1}.dss-contextbar{gap:8px}.dss-headeractions{flex:1;justify-content:flex-end}.dss-toolbar>.dss-search{flex-basis:100%}.dss-toolbar>.dss-select{flex:1;max-width:none}.dss-rowstate>span{display:none}.dss-listsummary{display:none}.dss-body:has(.dss-workarea[data-split=true])>.dss-sidebar{display:none}.dss-detailheader{padding:12px 17px}.dss-section,.dss-contentpad{padding:17px}.dss-detailfooter{padding:10px 13px}.dss-diff{grid-template-columns:minmax(0,1fr)}}
@container (max-width:480px){.dss-header{padding:12px}.dss-headrow{align-items:flex-start;gap:8px;flex-wrap:wrap;margin-bottom:10px}.dss-brand{margin-left:auto}.dss-logo,.dss-version{display:none}.dss-titlewrap{gap:4px}.dss-titlewrap>.dss-iconbtn{width:22px}.dss-contextfield{min-width:100%;flex:1;justify-content:space-between}.dss-contextfield .dss-select{max-width:70%;min-width:150px}.dss-headeractions .dss-btn{padding:6px 8px;font-size:12px!important}.dss-headeractions{gap:5px}.dss-sidebar{display:none}.dss-main{padding:12px 10px 0}.dss-rowtitle strong{font-size:14px}.dss-skillrow{padding:11px 10px;gap:8px}.dss-rowmeta{gap:6px}.dss-rowmeta>span+span{padding-left:6px}.dss-check{font-size:11px}.dss-toolbar{gap:7px}.dss-overlay{padding:8px}.dss-modalheader{padding:14px}.dss-modalbody{padding:15px}.dss-modalfooter{padding:11px 14px}.dss-modalheader h2{font-size:16px}.dss-detailheader h2{font-size:19px}.dss-detailkind{font-size:11px}.dss-tabs{gap:18px;padding:0 17px}.dss-section,.dss-contentpad{padding:16px}.dss-detailfooter>span{display:none}.dss-statelayers>div{gap:8px}.dss-statelayers>div>span{min-width:92px;font-size:11px}.dss-statelayers strong{font-size:11px}.dss-policyrow strong{font-size:11px}.dss-helppopover{width:255px}.dss-resourceadd{align-items:stretch}.dss-resourceadd .dss-input{flex-basis:100%}.dss-bulk{gap:4px}.dss-bulk .dss-btn{padding:5px 7px;font-size:12px!important}.dss-noticearea{padding:8px 12px 0}.dss-historyrow{gap:8px;padding:10px}.dss-historyrow>svg{display:none}}
@media (prefers-reduced-motion:reduce){.dss *{animation:none!important;transition:none!important}}
.dss-scopebar{display:flex;align-items:center;gap:10px 14px;flex-wrap:wrap;padding:11px 22px;border-bottom:1px solid var(--dss-line);flex:none;background:var(--dss-bg)}
.dss-scopetabs{display:inline-flex;align-items:center;gap:3px;padding:3px;border:1px solid var(--dss-line);border-radius:9px;background:var(--dss-soft)}
.dss-scopetabs>[role=tab],.dss-scopebar>[role=tab]{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:6px 12px;min-height:32px;border:0;border-radius:6px;background:transparent;color:var(--dss-muted);font-size:13px!important;font-weight:500;white-space:nowrap}
.dss-scopetabs>[role=tab][aria-selected=true],.dss-scopebar>[role=tab][aria-selected=true]{background:var(--dss-bg);color:var(--dss-blue);box-shadow:0 1px 4px #0000000a}
.dss-tabcount{padding:1px 5px;border-radius:5px;background:color-mix(in srgb,var(--dss-faint) 9%,transparent);font-size:11px;font-variant-numeric:tabular-nums;line-height:1.5;color:inherit}
.dss-modecounts{display:flex;align-items:center;gap:8px 14px;flex-wrap:wrap;color:var(--dss-muted);font-size:12px;line-height:1.6;min-width:0}
.dss-modecounts>span{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
.dss-modecounts strong{font-weight:600;color:var(--dss-text);font-variant-numeric:tabular-nums}
.dss-catalogstatus{display:flex;align-items:center;gap:8px;padding:10px 12px;margin-bottom:10px;border:1px solid color-mix(in srgb,#c88b23 22%,var(--dss-line));border-radius:7px;background:color-mix(in srgb,#c88b23 7%,var(--dss-bg));color:var(--dss-muted);font-size:12px;line-height:1.7;flex:none}
.dss-modeavailable,.dss-provided{display:inline-flex;align-items:center;gap:5px;padding:3px 7px;border-radius:5px;font-size:12px;line-height:1.5;white-space:nowrap}
.dss-modeavailable{color:var(--dss-green);background:color-mix(in srgb,var(--dss-green) 7%,transparent)}
.dss-provided{color:var(--dss-muted);background:var(--dss-soft)}
.dss-rowstate .dss-modeavailable,.dss-rowstate .dss-provided{display:inline-flex!important}
@container (max-width:1000px){.dss-scopebar{padding:10px 16px;gap:8px 12px}.dss-modecounts{gap:6px 10px}}
@container (max-width:700px){.dss-scopebar{align-items:flex-start}.dss-scopetabs{max-width:100%}.dss-scopetabs>[role=tab]{padding:6px 9px}.dss-modecounts{flex-basis:100%;font-size:12px}}
@container (max-width:480px){.dss-scopebar{padding:9px 12px}.dss-modeavailable,.dss-provided{padding:2px 5px;font-size:11px}.dss-catalogstatus{align-items:flex-start}}
.dss-externalchange{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:14px 20px 0;padding:10px 12px;border-radius:7px;background:color-mix(in srgb,#c88b23 8%,var(--dss-bg));color:#a87923;font-size:11px}

.dss-modecounts{flex:none;margin-bottom:10px}
.dss-modecounts>button{display:inline-flex;align-items:center;gap:6px;min-height:31px;padding:5px 9px;border:1px solid var(--dss-line);border-radius:6px;background:var(--dss-bg);color:var(--dss-muted);font-size:12px;white-space:nowrap}
.dss-modecounts>button:hover:not(:disabled){background:var(--dss-soft)}
.dss-modecounts>button[aria-pressed=true]{border-color:color-mix(in srgb,var(--dss-blue) 25%,var(--dss-line));color:var(--dss-blue);background:color-mix(in srgb,var(--dss-blue) 7%,var(--dss-bg))}
.dss-modecounts>button[aria-pressed=true] strong{color:var(--dss-blue)}
`;

// src/wire.mjs
var PACKAGE = "dsh-skill-studio";
var NS = "skillStudio";
function jsonValue(value, depth = 0) {
  if (depth > 20) throw new Error("REQUEST_TOO_DEEP");
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (Array.isArray(value)) {
    if (value.length > 5e3) throw new Error("REQUEST_TOO_LARGE");
    value.forEach((x) => jsonValue(x, depth + 1));
    return value;
  }
  if (typeof value === "object" && value && Object.getPrototypeOf(value) === Object.prototype) {
    const entries = Object.entries(value);
    if (entries.length > 5e3) throw new Error("REQUEST_TOO_LARGE");
    for (const [key, item] of entries) {
      if (["__proto__", "constructor", "prototype"].includes(key)) throw new Error("INVALID_KEY");
      jsonValue(item, depth + 1);
    }
    return value;
  }
  throw new Error("INVALID_JSON");
}
var codec = (typeSymbol) => ({ mode: "strict", typeSymbol, create: () => ({ parse: jsonValue }) });
var descriptor = {
  id: `${PACKAGE}#skillStudio/request`,
  service: NS,
  namespace: NS,
  method: "request",
  invocation: { kind: "direct" },
  parameters: [{ name: "payload", wire: "payload", source: "json", codec: codec(`${PACKAGE}#Request`) }],
  result: codec(`${PACKAGE}#Response`)
};
var contribution = { package: PACKAGE, descriptors: [descriptor] };

// src/catalog-sync.mjs
var UI_SKILL = "@deepseek-ai/dsh-client-ui-skill";
function createCatalogSynchronizer(ctx) {
  let disposed = false;
  let requested = 0;
  let active;
  const unsupported = (reason) => ({ state: "unsupported", reason });
  async function restartSource() {
    const loader = typeof ctx?.get === "function" ? ctx.get("loader") : ctx?.loader;
    if (typeof loader?.entries !== "function") return unsupported("loader-unavailable");
    const entries = [...loader.entries()].filter((entry2) => entry2?.options?.name === UI_SKILL);
    if (entries.length !== 1) return unsupported(entries.length ? "ambiguous-skill-plugin" : "skill-plugin-unavailable");
    const entry = entries[0];
    if (entry.disabled || typeof entry.fiber?.restart !== "function") return unsupported("skill-plugin-inactive");
    await entry.fiber.restart();
    return { state: "synced", plugin: UI_SKILL };
  }
  async function drain(token) {
    let result;
    try {
      do {
        const current = requested;
        if (disposed) return unsupported("disposed");
        try {
          result = await restartSource();
        } catch (error) {
          result = { state: "failed", reason: "skill-plugin-restart-failed", message: String(error?.message ?? error).slice(0, 600) };
        }
        if (disposed) return unsupported("disposed");
        if (current === requested) return result;
      } while (true);
    } finally {
      if (active === token) active = void 0;
    }
  }
  return {
    sync() {
      if (disposed) return Promise.resolve(unsupported("disposed"));
      requested++;
      if (!active) {
        const token = {};
        token.promise = Promise.resolve().then(() => drain(token));
        active = token;
      }
      return active.promise;
    },
    dispose() {
      disposed = true;
    }
  };
}

// src/client.mjs
var inject = ["slots", "locale", "remote", "sessions", "layout"];
var PANEL_ID = "laochen-skill-studio";
function Icon2() {
  return import_react2.default.createElement(
    "svg",
    { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true },
    import_react2.default.createElement("path", { d: "M5 4h10l4 4v12H5zM15 4v5h4M8 13h8M8 16h5" })
  );
}
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "skill-studio: dictionaries");
  ctx.effect(() => {
    const node = document.createElement("style");
    node.dataset.plugin = PACKAGE;
    node.textContent = style_default;
    document.head.append(node);
    return () => node.remove();
  }, "skill-studio: styles");
  const mount = ctx.remote.$mount(contribution);
  const t = ctx.locale.bind(NS);
  const synchronizer = createCatalogSynchronizer(ctx);
  const mutations = /* @__PURE__ */ new Set(["create", "save", "setPolicy", "saveFile", "deleteFile", "toggle", "delete", "restore", "applyImport", "copy", "batchToggle"]);
  const revisionListeners = /* @__PURE__ */ new Set();
  let lastSession;
  let revision = 0;
  let externalRevision = 0;
  let baseline = false;
  let disposed = false;
  let polling = false;
  function sessionId() {
    const rows = ctx.sessions.list.getSnapshot().byId;
    const active = Object.entries(rows).find(([, row]) => row.retainedBy?.mainView > 0)?.[0];
    if (active) lastSession = active;
    if (lastSession && !rows[lastSession]) lastSession = void 0;
    return lastSession;
  }
  ctx.effect(() => ctx.sessions.list.subscribe(() => {
    sessionId();
  }), "skill-studio: session target");
  async function invoke(action, args = {}) {
    await mount;
    const result = await ctx.get("remote.skillStudio").request({ action, ...args, sessionId: sessionId() });
    if (!result.ok) throw Object.assign(new Error(result.error.message), { code: result.error.code });
    if (!result.value.success) {
      const error = result.value.error;
      throw Object.assign(new Error(error.message), { code: error.code, ...error.fsCode ? { fsCode: error.fsCode } : {}, ...error.recoveryPath ? { recoveryPath: error.recoveryPath } : {} });
    }
    return result.value.data;
  }
  async function call(action, args = {}) {
    const data = await invoke(action, args);
    if (mutations.has(action)) {
      const menu = await synchronizer.sync();
      data.synchronization = { ...data.synchronization, menu: menu.state };
      if (data.revision !== void 0) {
        revision = data.revision;
        baseline = true;
      }
    }
    return data;
  }
  async function pollRevision() {
    if (disposed || polling || document.visibilityState === "hidden") return;
    polling = true;
    try {
      const next = await invoke("revision");
      if (disposed) return;
      const changed = baseline && next.revision !== revision;
      revision = next.revision;
      baseline = true;
      if (changed) {
        await synchronizer.sync();
        externalRevision++;
        for (const listener of revisionListeners) listener();
      }
    } catch {
    } finally {
      polling = false;
    }
  }
  ctx.effect(() => {
    void pollRevision();
    const timer = setInterval(() => {
      void pollRevision();
    }, 5e3);
    const onVisible = () => {
      if (document.visibilityState !== "hidden") void pollRevision();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      disposed = true;
      clearInterval(timer);
      synchronizer.dispose();
      document.removeEventListener("visibilitychange", onVisible);
      revisionListeners.clear();
    };
  }, "skill-studio: cross-client catalogue refresh");
  function StudioPage() {
    import_react2.default.useSyncExternalStore((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot());
    const observedRevision = import_react2.default.useSyncExternalStore((listener) => {
      revisionListeners.add(listener);
      return () => revisionListeners.delete(listener);
    }, () => externalRevision);
    return import_react2.default.createElement(Panel, { call, t, externalRevision: observedRevision, back: () => ctx.layout.selectPanel(null) });
  }
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: PANEL_ID, order: 1.5, label: () => t("nav"), locale: NS }, Icon2));
  ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: PANEL_ID, locale: NS }, StudioPage));
}
return module.exports; }});
