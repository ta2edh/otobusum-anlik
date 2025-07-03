//
//  RCTUserDefaultsManager.m
//  otobusumanlik
//
//  iOS UserDefaults ve Settings.bundle entegrasyonu için native module
//

#import "RCTUserDefaultsManager.h"
#import <React/RCTLog.h>

@implementation RCTUserDefaultsManager

RCT_EXPORT_MODULE(UserDefaultsManager);

// iOS Settings.bundle'dan app_language değerini oku
RCT_EXPORT_METHOD(getLanguagePreference:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        NSString *language = [defaults stringForKey:@"app_language"];
        
        if (language == nil) {
            language = @"system"; // Default value
        }
        
        resolve(language);
    }
    @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to get language preference", nil);
    }
}

// iOS Settings.bundle'a app_language değerini yaz
RCT_EXPORT_METHOD(setLanguagePreference:(NSString *)languageCode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        [defaults setObject:languageCode forKey:@"app_language"];
        [defaults synchronize];
        
        resolve(@YES);
    }
    @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to set language preference", nil);
    }
}

// iOS Settings app'ini aç
RCT_EXPORT_METHOD(openSettings:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            NSURL *settingsURL = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
            if ([[UIApplication sharedApplication] canOpenURL:settingsURL]) {
                [[UIApplication sharedApplication] openURL:settingsURL options:@{} completionHandler:^(BOOL success) {
                    if (success) {
                        resolve(@YES);
                    } else {
                        reject(@"ERROR", @"Failed to open settings", nil);
                    }
                }];
            } else {
                reject(@"ERROR", @"Cannot open settings URL", nil);
            }
        }
        @catch (NSException *exception) {
            reject(@"ERROR", @"Failed to open settings", nil);
        }
    });
}

// Sistem dilini al
RCT_EXPORT_METHOD(getSystemLanguage:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSString *systemLanguage = [[NSLocale preferredLanguages] firstObject];
        
        // Language code'u sadece dil kısmına indirge (örn: "en-US" -> "en")
        NSArray *components = [systemLanguage componentsSeparatedByString:@"-"];
        NSString *languageCode = [components firstObject];
        
        resolve(languageCode);
    }
    @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to get system language", nil);
    }
}

// Event emitter için gerekli
- (NSArray<NSString *> *)supportedEvents {
    return @[@"LanguageChanged"];
}

// UserDefaults değişikliklerini dinle
- (void)startObserving {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(userDefaultsChanged:)
                                                 name:NSUserDefaultsDidChangeNotification
                                               object:nil];
}

- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)userDefaultsChanged:(NSNotification *)notification {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *language = [defaults stringForKey:@"app_language"];
    
    if (language != nil) {
        [self sendEventWithName:@"LanguageChanged" body:@{@"language": language}];
    }
}

@end
