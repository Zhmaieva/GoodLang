export default class FeatureToggleService {
    get = (featureName) => localStorage.getItem(featureName) === 'true';
    toggle = (featureName, enabled) => localStorage.setItem(featureName, enabled.toString());

    FEATURE_NAME = {
        LOCALIZATION: 'LOCALIZATION'
    }
}

export const featureToggleService = new FeatureToggleService();