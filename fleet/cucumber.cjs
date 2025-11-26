module.exports = {
  default: {
    requireModule: ['tsx'],
    require: ['fleet/src/tests/step_definitions/*.ts'],
    format: ['progress', 'html:fleet/cucumber-report.html'],
    paths: ['fleet/src/tests/features/*.feature'],
    publishQuiet: true,
    tags: 'not @persistence'
  },
  persistence: {
    requireModule: ['tsx'],
    require: ['fleet/src/tests/step_definitions/*.ts'],
    format: ['progress', 'html:fleet/cucumber-report.html'],
    paths: ['fleet/src/tests/features/*.feature'],
    publishQuiet: true,
    tags: '@persistence'
  },
  all: {
    requireModule: ['tsx'],
    require: ['fleet/src/tests/step_definitions/*.ts'],
    format: ['progress', 'html:fleet/cucumber-report.html'],
    paths: ['fleet/src/tests/features/*.feature'],
    publishQuiet: true
  }
};
