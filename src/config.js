// window.Scenario = {
//   config: {
//     AUTH_TOKEN: '',
//     API_HOST: 'https://predplatne.dennikn.sk/api/v1',
//     SCENARIO_ID: null
//   }
// };

// window.Segments = {
//   config: {
//     AUTH_TOKEN: '',
//     API_HOST: 'https://predplatne.dennikn.sk',
//     CANCEL_PATH: '#',
//     SEGMENT_ID: null
//   }
// };

export const { AUTH_TOKEN, API_HOST, SCENARIO_ID } = window.Scenario.config;

export const URL_SCENARIO_DETAIL = `${API_HOST}/scenarios/info?id=`;
export const URL_SCENARIO_CREATE = `${API_HOST}/scenarios/create`;
export const URL_SEGMENTS_INDEX = `${API_HOST}/user-segments/list`;
export const URL_TRIGGERS_INDEX = `${API_HOST}/events/list`;
export const URL_MAILS_INDEX = `${API_HOST}/mail-template/list`;
export const URL_TOOLTIPS = `${API_HOST}/scenarios/element`;
