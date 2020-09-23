export async function loadConfig() {
  try {
    const data: any = fetch("/config.json")
    if (data.app) {
      AppConfig.appBaseUrl = data.app.appBaseUrl;
      AppConfig.remoteServiceBaseUrl = data.app.remoteServiceBaseUrl;
    }
  } catch (e) {

  }
}

export const AppConfig = {
  appBaseUrl: process.env.REACT_APP_APP_BASE_URL,
  remoteServiceBaseUrl: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
}
