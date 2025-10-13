
<!-- Orion-App Layout -->
<!DOCTYPE html>
<html class='logged-in  feed3p0 old-login strava-orion responsive' dir='ltr' lang='en-US' xmlns='http://www.w3.org/TR/html5' xmlns:fb='http://www.facebook.com/2008/fbml' xmlns:og='http://opengraphprotocol.org/schema/'>
<!--
layout orion app
-->
<head>
<head>
<meta charset='UTF-8'>
<meta content='width = device-width, initial-scale = 1, maximum-scale = 5, user-scalable = yes' name='viewport'>
<style nonce='' type='text/css'>
.spinner, .spinner .status {
  position: relative;
}
.spinner {
  margin-top: 1em;
  margin-bottom: 1em;
}
.spinner .status {
  top: 2px;
  margin-left: 0.5em;
}
.spinner .status:empty {
  display: none;
}
.spinner.lg .graphic {
  border-width: 3px;
  height: 32px;
  width: 32px;
}
.spinner.tiny {
  height: 10px;
  width: 10px;
}
.spinner.centered, .spinner.vcentered {
  box-sizing: border-box;
  width: 100%;
}
.spinner.vcentered {
  left: 0;
  margin-top: -12px;
  position: absolute;
  right: 0;
  text-align: center;
  top: 50%;
}
.spinner .graphic, .ajax-loading-image {
  animation: spin 1.2s infinite linear;
  box-sizing: border-box;
  border-color: #eee;
  border-radius: 50%;
  border-style: solid;
  border-top-color: #666;
  border-top-style: solid;
  border-width: 2px;
  content: "";
  display: inline-block;
  height: 20px;
  position: relative;
  vertical-align: middle;
  width: 20px;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>

<link rel="stylesheet" href="https://d3nn82uaxijpm6.cloudfront.net/assets/strava-app-icons-b1e0b294059427fdb5e1e821d3a4932376a1ec644a557f31da906b42aedd887b.css" media="screen" />
<link rel="stylesheet" href="https://d3nn82uaxijpm6.cloudfront.net/assets/strava-orion-dafacf6b4b14675d2ae87c0e45f91cc7d321c84451ddd3b10cd08722967de14b.css" media="screen" />

<link href='https://d3nn82uaxijpm6.cloudfront.net/apple-touch-icon-180x180.png?v=dLlWydWlG8' rel='apple-touch-icon' sizes='180x180'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/apple-touch-icon-152x152.png?v=dLlWydWlG8' rel='apple-touch-icon' sizes='152x152'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/apple-touch-icon-144x144.png?v=dLlWydWlG8' rel='apple-touch-icon' sizes='144x144'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/apple-touch-icon-120x120.png?v=dLlWydWlG8' rel='apple-touch-icon' sizes='120x120'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/apple-touch-icon-114x114.png?v=dLlWydWlG8' rel='apple-touch-icon' sizes='114x114'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/apple-touch-icon-76x76.png?v=dLlWydWlG8' rel='apple-touch-icon' sizes='76x76'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/apple-touch-icon-72x72.png?v=dLlWydWlG8' rel='apple-touch-icon' sizes='72x72'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/apple-touch-icon-60x60.png?v=dLlWydWlG8' rel='apple-touch-icon' sizes='60x60'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/apple-touch-icon-57x57.png?v=dLlWydWlG8' rel='apple-touch-icon' sizes='57x57'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/favicon-32x32.png?v=dLlWydWlG8' rel='icon' sizes='32x32' type='image/png'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/icon-strava-chrome-192.png?v=dLlWydWlG8' rel='icon' sizes='192x192' type='image/png'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/favicon-96x96.png?v=dLlWydWlG8' rel='icon' sizes='96x96' type='image/png'>
<link href='https://d3nn82uaxijpm6.cloudfront.net/favicon-16x16.png?v=dLlWydWlG8' rel='icon' sizes='16x16' type='image/png'>
<link href='/manifest.json?v=dLlWydWlG8' rel='manifest'>
<meta content='#FC5200' name='msapplication-TileColor'>
<meta content='https://d3nn82uaxijpm6.cloudfront.net/mstile-144x144.png?v=dLlWydWlG8' name='msapplication-TileImage'>
<meta content='#F7F7FA' name='theme-color'>
<meta content='Strava' name='apple-mobile-web-app-title'>
<meta content='Strava' name='application-name'>
<meta content='yes' name='apple-mobile-web-app-capable'>
<meta content='black' name='apple-mobile-web-app-status-bar-style'>

<script type='application/ld+json'>
{
  "@context": "http://schema.org",
  "@type": "Organization",
  "name": "Strava",
  "url": "https://www.strava.com/",
  "logo": "https://d3nn82uaxijpm6.cloudfront.net/assets/website_v2/svgs/strava-orange-c33577e7257d5ac4a2e972564c5c7556037f3d005c5b5cb2f0e0d06ac7b84c47.svg",
  "sameAs": [
    "https://facebook.com/Strava",
    "https://twitter.com/strava",
    "https://instagram.com/strava",
    "https://youtube.com/stravainc",
    "https://www.linkedin.com/company/strava-inc./",
    "https://stories.strava.com",
    "https://github.com/strava",
    "https://medium.com/strava-engineering"
  ]
}


</script>
<meta name="csrf-param" content="authenticity_token" />
<meta name="csrf-token" content="q_z57zZO2zk7IlzMRztmNYnVHI-otNWArXD-Vtt1Vg482c_nULYSdOH1uKntWG6IxK-Hi1eUxNGEuv96zYEF3g" />
<script>
  window.StravaSentry = {
   enabled: true,
   release: "c5133864265f50525982670c2fb1120e94dee76c",
   userId: 11694245,
   environment: "production",
   dsn: "https://6ffc1c27d92347b49d7659886aab9deb@o352714.ingest.sentry.io/5816222",
   debug: "false",
   sampleRate: 1,
   pageProperties: null,
   mobileOS: "Web",
   isMobile: false
 }

 window.StravaDevTools = {
   enabled: false
 }
</script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/runtime-5249638f63713f1761ed.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/97118-3b90e2d145f9db07b842.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/29683-578789b04d1b506ba8ee.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/10603-0d2522db11b3d61a86c0.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/20459-3bc8c6cf573225ac4291.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/94409-be9b9c0ade04bc9f598f.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/23105-4f6a64d72511abe5a332.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/65827-430ab1b3999ebdf652b2.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/37661-2c44bb2d265d43f4cdf9.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/9406-76cff92023c8c5a02ce2.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/96757-47922202032b4b1aba56.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/55911-aadc1b6fd6ae178044bf.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/57426-9ed284831cf22206bd81.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/20132-f9fdf2ea14c20b384ae6.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/63406-71601e955c3889079880.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/26329-9446ab6fa688a7d282bb.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/73170-9564210b94bb3fed9a36.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/59859-c570120929189c07bc23.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/18010-71bf6c6921f21868cae9.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/74015-640507c902bd99d7a2b4.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/77399-91e56c432798c23876dc.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/97154-ed489471a3aec746430e.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/67871-c813150ef9dccb773025.js"></script>
<script src="//d3nn82uaxijpm6.cloudfront.net/packs/js/strava_with_framework-743965ef61c425ae8b22.js"></script>

<script>
  !function() {
   if (!!window.stravaPublicServiceEnv) {
     // Object containing no secret key value pairs that are expected to be seen and used in the browser.
     // This keys are commonly passed to 3rd party libs or tooling.
     window.stravaPublicServiceEnv({
       VIDEOJS_LOG_LEVEL: "error"
     });
   }
 }();
</script>

<script src="https://d3nn82uaxijpm6.cloudfront.net/assets/strava-head-fe23e12219a4ae9745e10ed4adbcf9831ae3a15ea4b4dc52eeeba18901eb3855.js"></script>


<link href='https://www.strava.com/activities/16112144168/edit' rel='canonical'>
<link href='https://www.strava.com/activities/16112144168/edit' hreflang='x-default' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit' hreflang='en' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=en-GB' hreflang='en-gb' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=fr-FR' hreflang='fr' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=de-DE' hreflang='de' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=pt-BR' hreflang='pt-br' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=es-ES' hreflang='es-es' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=it-IT' hreflang='it' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=ru-RU' hreflang='ru' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=es-419' hreflang='es-419' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=ja-JP' hreflang='ja' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=nl-NL' hreflang='nl' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=zh-TW' hreflang='zh-tw' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=pt-PT' hreflang='pt-pt' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=zh-CN' hreflang='zh-cn' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=id-ID' hreflang='id-id' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=pt-PT' hreflang='pt' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=es-ES' hreflang='es' rel='alternate'>
<link href='https://www.strava.com/activities/16112144168/edit?hl=zh-CN' hreflang='zh' rel='alternate'>

<title>Morning Run | Run | Strava</title>
<link rel="stylesheet" href="//d3nn82uaxijpm6.cloudfront.net/packs/css/9406-f80446f6.css" media="screen" />
<link rel="stylesheet" href="//d3nn82uaxijpm6.cloudfront.net/packs/css/26329-17ac5d40.css" media="screen" />
<link rel="stylesheet" href="//d3nn82uaxijpm6.cloudfront.net/packs/css/strava_with_framework-f23862b9.css" media="screen" />
<link rel="stylesheet" href="https://d3nn82uaxijpm6.cloudfront.net/assets/activities/edit-849ab6be8141187816a6ef1147614f8804ea1a39018d3383a8c9ccee215c768b.css" media="screen" />

</head>

<script>
  !function(options){
   window.Strava = window.Strava || {};
   var _enabled = true;
   var _options = options;
   var _snowplowReady = null;

   window.Strava.ExternalAnalytics = window.Strava.ExternalAnalytics || (
     {
       isEnabled: function() {
         // snowplow script can be blocked by our consent management tool
         // see https://strava.atlassian.net/wiki/x/DIBuzQ
         return _enabled && snowplow !== undefined && typeof snowplow === 'function';
       },
       isDebug: function() {
         return _options.debug;
       },
       track: function() {
       },
       trackV2: function(event) {
         var eventData = {
           'category': event.category,
           'page': event.page,
           'action': event.action,
           'element': event.element || null,
           'properties': event.properties || {}
         }
         if (this.isEnabled()) {
           var a = snowplow('getUserId');
           this.log("trackV2", {athleteId: a});
           snowplow('trackSelfDescribingEvent', {
             schema: 'iglu:com.strava/track/jsonschema/1-0-0',
             data: eventData
           });
         } else {
           if(this.isDebug()){
             // toggle defined in - https://github.com/strava/active/blob/main/lib/strava/external_analytics.rb
             // to turn on - Strava::ExternalAnalytics.turn_on_debug
             // to turn off - Strava::ExternalAnalytics.turn_off_debug
             !!console.table && console.table(eventData);
           }
         }
       },
       trackLink: function() {
       },
       trackForm: function() {
       },
       identifyV2: function () {
       },
       getExperimentContext: function(pageProperties) {
         var experiment = ( pageProperties || {} ).experiment_info || {};
         if (experiment.experiment_cohort && experiment.experiment_name) {
           this.log('found experiment with values', experiment);
           return {
             schema: 'iglu:com.strava/web_experiment/jsonschema/1-0-0',
             data: {
               experiment_name: experiment.experiment_name,
               cohort: experiment.experiment_cohort,
               forced: experiment.experiment_forced === true
             }
           };
         } else {
           return null;
         }
       },
       page: function(pageProperties) {
         if(this.isEnabled()) {
           snowplow('trackPageView');
         }
       },
       identify: function(athleteId, options, eventName) {
         if (this.isEnabled()) {
           this.log("identify user", {athleteId: athleteId});
           var properties = options || {}
           properties.athlete_id = athleteId;
           var eventData = {
             'category': 'identify',
             'page': null,
             'action': eventName,
             'element': null,
             'properties': properties
           };
           snowplow('trackSelfDescribingEvent', {
             schema: 'iglu:com.strava/track/jsonschema/1-0-0',
             data: eventData
           });
         }
       },
       reset: function() {
         if(this.isEnabled()) {
           this.log("reseting athlete id",{});
           snowplow('setUserId', null)
           var spCookie = document.cookie.match('_sp_id\\.[a-f0-9]+')
           if(spCookie != null) {
             document.cookie = spCookie[0] + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
           }
         }
       },
       setup: function(athleteId, pageProperties) {
         if(this.isEnabled()) {
           this.log("setup snowplow", {athleteId: athleteId});
           snowplow("newTracker", "cf", "c.strava.com", {
             appId: "strava-web",
             platform: "web"
           });

           /*
           * Disable anonymous tracking and set userId if we have athleteId
           * this assumes that performance consent is given at this point
           * so we can enable non-anonymous tracking.
           *
           * Anonymous tracking could be enabled if an athlete revoked performance consent
           * and before giving consent again.
           */
           snowplow('disableAnonymousTracking');
           snowplow('setUserId', athleteId);
           /*
            * This allows sending of page pings after an initial page view
            * is generated. This should allow us to track page pings when
            * the user continues interacting with the page after the initial page
            * view event is generated.
            */
           snowplow('enableActivityTracking', 30, 30);

           var experimentContext = this.getExperimentContext(pageProperties);
           if (experimentContext) {
             snowplow('addGlobalContexts', [experimentContext]);
           }
           snowplow('enableFormTracking');
         }
       },
       getDomainUserId: function() {
         var d = jQuery.Deferred();
         if (this.isEnabled()) {
           if (!_snowplowReady) {
             _snowplowReady = jQuery.Deferred();
             snowplow(function(){
               _snowplowReady.resolve(this.cf.getDomainUserId());
             });
           }
           _snowplowReady.always(function(getDomainUserId){
             d.resolve(getDomainUserId);
           });
         } else {
           d.reject(null);
         }
         return d;
       },
       log: function(message, values) {
         if(this.isDebug()) {
           console.log(message, 'background-color: yellow; color: blue; font-size: medium;', values);
         }
       },
       debug: function(value) {
         _options.debug = value;
       }
     }
   )
 }({
   is_mobile: false,
   os: "",
   debug: false,
   athlete_id: 11694245,
   locale: "en-US"
 });
</script>

<script>
  function loadSnowplow() {
   var analytics = window.analytics = window.analytics || [];
   if(analytics.invoked) {
     window.console && console.error && console.error("Segment snippet included twice.");
   } else {
     (function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)};p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","https://d3nn82uaxijpm6.cloudfront.net/8f96b1247cf4359f8fec.js","snowplow"));
     var pageProperties = null;
     var athleteId = 11694245;
     Strava.ExternalAnalytics.setup(athleteId, pageProperties);
     Strava.ExternalAnalytics.page(pageProperties);
   }
 }
</script>
<script>
  loadSnowplow();
</script>

<script>
  !function(debug){
   window.Strava = window.Strava || {};
   var _enabled = true;
   var _debug = !!debug;
   var _branchData = null;

   window.Strava.BranchIO = window.Strava.BranchIO || (
     {
       isEnabled: function() {
         return _enabled;
       },
       isDebug: function() {
         return _debug;
       },
       dataToLocalStorage: function() {
         if (!_branchData) {
           _branchData = new Strava.BranchAnalytics.BranchData();
         }

         var d = this.data()
         var that = this;
         d.done(function(data) {
           that.log('storing data %o to local storage', data)
           _branchData.data(data)
         });
         d.fail(function(message) {
           that.log('failed to retrieve data from branch');
           _branchData.data({})
         });
         return d;
       },
       createLink: function(options) {
         var d = jQuery.Deferred();
         var data = null;
         const that = this;
         var callback = function(e, l) {
           if (!e) {
             d.resolve(l);
           } else {
             d.reject(e);
           }
         }

         Strava.ExternalAnalytics
           .getDomainUserId()
           .always(function(domainUserId){
             if (domainUserId) {
               options.data['domainUserId'] = domainUserId;
             }

             if(that.isEnabled()) {
               branch.link(options, callback);
             };
         });

         return d;
       },
       dataFromLocalStorage: function() {
         if (!_branchData) {
           _branchData = new Strava.BranchAnalytics.BranchData();
         }
         return _branchData.data();
       },
       clearLocalStorage: function() {
         if (!_branchData) {
           _branchData = new Strava.BranchAnalytics.BranchData();
         }
         _branchData.data({});
       },
       data: function(checkLocalStorage) {
         var d = jQuery.Deferred();
         var that = this;
         var c = function(message, meta_data) {
           var storedData = null;

           if(message) {
             d.reject(message);
           } else {
             if (checkLocalStorage == true && (meta_data == null || meta_data.data == "" || meta_data.data == null)) {
               storedData = that.dataFromLocalStorage();
               that.clearLocalStorage();

               d.resolve(storedData);
             } else {
               d.resolve(meta_data);
             }
           }
         };

         if(this.isEnabled()) {
           branch.data(c);
           this.log('%cdata (branch enabled)');
         } else {
           this.log('%cdata (branch disabled)');
           d.resolve({});
         }
         return d;
       },
       identify: function(hashedAthleteId) {
         var that = this;
         var callback = function(error, data) {
           if (error) {
             console.log(error);
           }
         }
         if(this.isEnabled() && hashedAthleteId) {
           branch.setIdentity(hashedAthleteId, callback);
           this.log('identifying athlete %o', hashedAthleteId);
         }
       },
       logout: function() {
         var that = this;
         var callback = function(error) {
           if (error) {
             console.log(error);
           }
         }
         branch.logout(callback);
       },
       track: function(eventName, metaData) {
         var that = this;
         var callback = function(error, data) {
           if (error) {
             console.log(error);
           }
         }
         if(this.isEnabled()) {
             this.log('tracking event - ', eventName);
             branch.logEvent(eventName, metaData, callback);
         }
       },
       log: function(message, values = '') {
         if(this.isDebug()) {
           console.log(`[branch] :::  ${message}`, values);
         }
       },
       debug: function(value) {
         _debug = value;
       }
     }
   )
 }(false);
</script>

<script>
  function loadBranch() {
   // load Branch
   (function(b,r,a,n,c,h,_,s,d,k){if(!b[n]||!b[n]._q){for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-latest.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h}})(window,document,"script","branch",function(b,r){b[r]=function(){b._q.push([r,arguments])}},{_q:[],_v:1},"addListener banner closeBanner closeJourney data deepview deepviewCta first init link logout removeListener setBranchViewData setIdentity track trackCommerceEvent logEvent disableTracking getBrowserFingerprintId crossPlatformIds lastAttributedTouchData setAPIResponseCallback qrCode".split(" "), 0);

   var options = {"metadata":{"external_identity_version":5,"next":false,"external_identity_hash":"36b9c32176b94564ffcf15f53873c06fe02456784ebb6e8e0b29b1e8975fac52"},"tracking_disabled":true}

   // clean legacy identities (non-hashed athlete ids)
   var branchSessionIdentity = JSON.parse(sessionStorage.getItem('branch_session') || '{}').identity;
   options.metadata.session_identity = branchSessionIdentity;

   if(branchSessionIdentity && branchSessionIdentity.length !== 64) {
     Strava.BranchIO.log('clearing legacy branch session identity %o', branchSessionIdentity);
     sessionStorage.removeItem('branch_session');
     options.metadata.session_identity_cleared = true;
   }else{
     options.metadata.session_identity_cleared = false;
   }

   // disable journeys on web
   // we currently do not use journeys on web and they conflict with our cookie consent management
   options.no_journeys = true;

   // init Branch
   branch.init("key_live_lmpPsfj2DP8CflI4rmzfiemerte7sgwm", options, (err, data) => {
     const branchInitialized = new CustomEvent('BranchInitialized', { detail: { err, data } });
     window.dispatchEvent(branchInitialized);

     var identity = data && data['identity'];
     var hashedAthleteId = "36b9c32176b94564ffcf15f53873c06fe02456784ebb6e8e0b29b1e8975fac52";

     if(hashedAthleteId && identity && identity.length !== 64) {
       Strava.BranchIO.log('purging branch session %o', identity);
       Strava.BranchIO.track("web_session_reset", {identity: identity});
       Strava.BranchIO.logout();
       Strava.BranchIO.identify(hashedAthleteId);
     }else{
       if (hashedAthleteId) {
         Strava.BranchIO.identify(hashedAthleteId);
       }else{
         Strava.BranchIO.log('no athlete to identify');
         Strava.BranchIO.logout();
       }
     }
   });
 }
</script>
<script>
  loadBranch();
</script>

</head>
<body>


<header id='global-header'><!--
deploy: c5133864265f50525982670c2fb1120e94dee76c
-->
<!--[if lte IE 8]>
<div class='alert alert-warning message warning mb-0 text-center'>
<p>It looks like you're using a version of Internet Explorer that Strava no longer supports. Please <a href='http://www.microsoft.com/en-us/download/ie.aspx?q=internet+explorer'>upgrade your web browser</a> &mdash; <a href='https://strava.zendesk.com/entries/20420212-Supported-Browsers-on-Strava'>Learn more</a>.</p>
</div>
<![endif]-->
<nav class='nav-bar container collapsable-nav' role='navigation'>
<div title="Return to the Strava home page" class="branding"><a class="branding-content" href="/"><span class="sr-only">Strava</span></a></div>
<!-- / Nav Menu Button -->
<a href="#container-nav" aria-expanded="false" aria-controls="container-nav" data-toggle="collapse" class="btn btn-default btn-mobile-menu" role="button">Menu</a>
<div class='nav-container collapse' id='container-nav'>
<form id='global-search-bar'>
<button class='btn btn-default btn-icon btn-icon-right' id='open-global-search-button' title='Search' type='button'>
<span class="app-icon-wrapper  "><span class="app-icon icon-search icon-lg icon-dark"></span></span>
</button>
<div class='form-group bottomless global-search-hidden' id='global-search-form-group'>
<div class='dropdown' id='global-search-filter'>
<button aria-expanded='false' aria-haspopup='true' class='btn btn-default btn-icon btn-icon-right' data-toggle='dropdown' data-value='athletes'>
<span class='btn-label'>Athletes</span>
<span class="app-icon-wrapper  "><span class="app-icon icon-caret-down icon-dark icon-sm"></span></span>
</button>
<ul aria-labeledby='global-search-filter' class='dropdown-menu' role='menu'>
<li>
<div class='clickable' data-value='activities'>
Activities
</div>
</li>
<li>
<div class='clickable' data-value='athletes'>
Athletes
</div>
</li>
<li>
<div class='clickable' data-value='clubs'>
Clubs
</div>
</li>
<li>
<div class='clickable' data-value='segments'>
Segments
</div>
</li>
</ul>
</div>
<div class='input-group'>
<input class='form-control' data-search-filter='athletes' id='global-search-field' placeholder='Search' type='text'>
<button class='btn btn-white btn-icon btn-icon-only' id='global-search-button' title='Search'>
<span class="app-icon-wrapper  "><span class="app-icon icon-search icon-lg icon-dark"></span></span>
</button>
<button class='btn btn-white btn-icon btn-icon-only' id='global-search-cancel' title='Cancel'>
<span class="app-icon-wrapper  "><span class="app-icon icon-remove icon-sm icon-dark"></span></span>
</button>
</div>
<div id='global-search-autocomplete-anchor'>
<div id='global-search-autocomplete-container'></div>
</div>
</div>
</form>

<ul class='global-nav nav-group'>
<li class='nav-item drop-down-menu accessible-nav-dropdown selected' data-log-category='dashboard' data-log-page='dashboard'>
<a class="selection nav-link accessible-nav-link" href="/dashboard">Dashboard
</a><button aria-haspopup class='selection nav-link accessible-nav-arrow' data-toggle='dropdown ' id='dashboard-dropdown-arrow' title='Expand dashboard menu'>
<span class="app-icon-wrapper  "><span class="app-icon icon-caret-down icon-dark"></span></span>
</button>
<ul aria-labelledby='dashboard-dropdown-arrow' class='options' role='menu'>
<li class=''>
<a href="/dashboard">Activity Feed</a>
</li>
<li class=''>
<a href="/clubs/search">Clubs</a>
</li>
<li class=''>
<a href="/athlete/segments/starred">My Segments</a>
</li>
<li class=''>
<a href="/athlete/routes">My Routes</a>
</li>
<li class='premium opt-group'>
<div class='text-caption4 subscription-callout'>
SUBSCRIPTION
</div>
<ul>
<li class='' data-log-element='my_goals'>
<a href="/athlete/goals">My Goals
</a></li>
</ul>
</li>
</ul>
</li>
<li class='nav-item drop-down-menu accessible-nav-dropdown' data-log-category='training' data-log-page='training'>
<a class="selection nav-link accessible-nav-link" href="/athletes/11694245/training/log">Training
</a><button aria-haspopup class='selection nav-link accessible-nav-arrow' data-toggle='dropdown ' id='dashboard-dropdown-arrow' title='Expand training menu'>
<span class="app-icon-wrapper  "><span class="app-icon icon-caret-down icon-dark"></span></span>
</button>
<ul aria-labelledby='dashboard-dropdown-arrow' class='options' role='menu'>
<li class=''>
<a href="/athlete/calendar">Training Calendar</a>
</li>
<li class=''>
<a href="/athlete/training">My Activities</a>
</li>
<li class='premium opt-group'>
<div class='text-caption4 subscription-callout'>
SUBSCRIPTION
</div>
<ul>
<li>
<a href="/athletes/11694245/training/log">Training Log</a>
</li>
<li class='' data-log-element='training_plans'>
<a href="/training-plans">Training Plans
</a></li>
<li class='' data-log-element='power_curve'>
<a href="/athlete/analysis">Power Curve
</a></li>
<li class='' data-log-element='fitness_and_freshness'>
<a href="/athlete/fitness">Fitness &amp; Freshness
</a></li>
</ul>
</li>
</ul>
</li>
<li class='nav-item'>
<a class="nav-link" href="/maps">Maps
</a></li>
<li class='nav-item'>
<a class="nav-link" href="/challenges">Challenges
</a></li>
</ul>

<ul class='user-nav nav-group'>
<li class='nav-item upgrade'>
<a class="experiment btn btn-sm btn-primary" href="/subscribe?cta=free-trial&amp;element=link&amp;origin=global_nav">Start Trial
</a></li>
<li class='nav-item' id='notifications'>
<div id='notifications-loading-placeholder' style='width: 46px;'></div>
<link rel="preload" href="https://web-assets.strava.com/assets/federated/notifications/remoteEntry.js?t=2025-10-13T09:13:31+00:00" as="script">
<div class='' data-is-published='' data-react-class='Microfrontend' data-react-props='{&quot;url&quot;:&quot;https://web-assets.strava.com/assets/federated/notifications/remoteEntry.js?t=2025-10-13T09:13:31+00:00&quot;,&quot;scope&quot;:&quot;strava_notifications&quot;,&quot;component&quot;:&quot;./Notifications&quot;,&quot;appContext&quot;:{},&quot;experiments&quot;:{}}' style='height: 100%'></div>

</li>
<li class='nav-item drop-down-menu user-menu accessible-nav-dropdown'>
<a class='nav-link selection accessible-nav-link' href='/athletes/11694245'>
<div class='avatar avatar-athlete'>

<div class='' data-is-published='' data-react-class='AvatarWrapper' data-react-props='{&quot;src&quot;:&quot;https://dgalywyr863hv.cloudfront.net/pictures/athletes/11694245/6242157/12/large.jpg&quot;,&quot;type&quot;:&quot;athlete&quot;,&quot;name&quot;:&quot;Nishanth&quot;,&quot;size&quot;:&quot;small&quot;,&quot;badge&quot;:&quot;&quot;,&quot;alt&quot;:&quot;Nishanth&quot;,&quot;experiments&quot;:{}}' style=''></div>

</div>
<span class='athlete-name'>
Nishanth Murugan
</span>
</a>
<button aria-haspopup class='selection nav-link accessible-nav-arrow' data-toggle='dropdown ' id='dashboard-dropdown-arrow' title='Expand profile menu'>
<span class="app-icon-wrapper  "><span class="app-icon icon-caret-down icon-dark"></span></span>
</button>
<ul class='options'>
<li class='featured'><a href="/athletes/search">Find Friends</a></li>
<li><a href="/athletes/11694245">My Profile</a></li>
<li><a href="/settings/profile">Settings</a></li>
<li><a href="/apps">Apps</a></li>
<li><a href="/subscription/perks">Subscriber Perks</a></li>
<li><a rel="nofollow" data-method="delete" href="/session">Log Out</a></li>
</ul>
</li>
<li class='nav-item drop-down-menu upload-menu'>
<a class='nav-link selection' href='/upload'>
<div class='upload-button-wrapper'>
<div class='upload-button icon-upload app-icon icon-sm'>
Upload
</div>
</div>
</a>
<ul class='options'>
<li>
<a href='/upload'>
<span class='upload-activity app-icon icon-upload-activity'></span>
Upload activity
</a>
</li>
<li>
<a href='/upload/manual'>
<span class='upload-activity-manual app-icon icon-upload-activity-manual'></span>
Add manual entry
</a>
</li>
<li>
<a href='/maps/create'>
<span class='upload-route app-icon icon-upload-route'></span>
Create route
</a>
</li>
<li>
<a href='/athletes/11694245/posts/new'>
<span class='create-post app-icon icon-create-post'></span>
Create post
</a>
</li>
</ul>
</li>
</ul>

</div>
</nav>
</header>

<div class='messages' id='system-messages-js'>
<div class='hidden alert alert-warning' id='ie-deprecation-message' role='alert'>
<div class='container'>
It looks like you're using a browser that Strava no longer supports. <a href='https://support.strava.com/hc/en-us/articles/216917637-Supported-Browsers-on-Strava'>Learn more</a>.
</div>
</div>
<div class='flash-messages'>
</div>
<div class='container'></div>
</div>


<div class='header'>
<div class='container'>
<div class='media media-middle'>
<h1 class='media-body'>Edit Activity</h1>
<div class='media-right'><button class="btn btn-primary save btn-save-activity">Save</button></div>
</div>
</div>
<hr class='topless'>
</div>
<div class='container mb-xl'>
<div class='row'>
<form class="edit_activity" id="edit-activity" action="/activities/16112144168" accept-charset="UTF-8" method="post"><input name="utf8" type="hidden" value="&#x2713;" autocomplete="off" /><input type="hidden" name="_method" value="patch" autocomplete="off" /><input type="hidden" name="authenticity_token" value="QE66RkaXgCJhnbieWdGDcspLy3dT_oPMU1uGx4saaAvXa4xOIG9Jb7tKXPvzsovPhzFQc6zekp16kYfrne472w" autocomplete="off" /><div class='col-md-8'>
<div class='edit-form'><div class='row'>
<div class='col-md-8'>
<div class='form-group'>
<label for="activity_name">Title</label>
<input class="form-control mb-md" required="required" type="text" value="Morning Run" name="activity[name]" id="activity_name" />
<label for="activity_description">Description</label>

<div class='form-control mb-md description' data-is-published='' data-react-class='ActivityDescriptionEdit' data-react-props='{&quot;entity&quot;:&quot;activity&quot;,&quot;entityId&quot;:16112144168,&quot;placeHolder&quot;:&quot;How&#39;d it go? Share more about your activity and use @ to tag someone.&quot;,&quot;activityDescription&quot;:null,&quot;viewingAthleteId&quot;:11694245,&quot;clubMentionsEnabled&quot;:true,&quot;inputName&quot;:&quot;activity[description]&quot;,&quot;analyticsFields&quot;:{&quot;page&quot;:&quot;edit_activity&quot;,&quot;category&quot;:&quot;edit_activity&quot;},&quot;experiments&quot;:{}}' style=''></div>

</div>

<div class='edit-activity-rpe-input mb-md' data-is-published='' data-react-class='PerceivedExertionInput' data-react-props='{&quot;entityId&quot;:16112144168,&quot;inputName&quot;:&quot;activity[perceived_exertion]&quot;,&quot;toggleName&quot;:&quot;activity[prefer_perceived_exertion]&quot;,&quot;perceivedExertion&quot;:null,&quot;preferPerceivedExertion&quot;:false,&quot;showToggle&quot;:false,&quot;analytics&quot;:{&quot;category&quot;:&quot;edit_activity&quot;,&quot;page&quot;:{&quot;outer&quot;:&quot;edit_activity&quot;,&quot;inner&quot;:&quot;edit_activity&quot;},&quot;properties&quot;:{&quot;activity_id&quot;:16112144168}},&quot;experiments&quot;:{}}' style=''></div>

<label for="activity_private_note">Private Notes</label>
<textarea class="form-control mb-md private-note" placeholder="Jot down private notes here. Only you can see these." name="activity[private_note]" id="activity_private_note">
</textarea>
<label>Privacy Controls</label>

<div class='edit-activity-visibility mb-md' data-is-published='' data-react-class='VisibilitySetting' data-react-props='{&quot;name&quot;:&quot;activity[visibility]&quot;,&quot;selectedValue&quot;:&quot;everyone&quot;,&quot;options&quot;:[{&quot;title&quot;:&quot;Everyone&quot;,&quot;detail&quot;:&quot;Anyone on Strava can view this activity. This activity will be visible on segment and challenge leaderboards, and other Strava features.&quot;,&quot;value&quot;:&quot;everyone&quot;},{&quot;title&quot;:&quot;Followers&quot;,&quot;detail&quot;:&quot;Only your followers will be able to access this activity&#39;s details. This activity will not appear on segment or challenge leaderboards, but may still count toward some challenge goals. Members who do not follow you may be able to view a summary of this activity depending on your other privacy settings.&quot;,&quot;value&quot;:&quot;followers_only&quot;},{&quot;title&quot;:&quot;Only You&quot;,&quot;detail&quot;:&quot;This activity is private. Only you can view it. If it counts toward a challenge, your followers may see updates on your progress. No one will see your activity page, and this activity won&#39;t show up on leaderboards or elsewhere on Strava, including group activities or Flybys.&quot;,&quot;value&quot;:&quot;only_me&quot;}],&quot;analytics&quot;:{&quot;category&quot;:&quot;edit_activity&quot;,&quot;page&quot;:{&quot;outer&quot;:&quot;edit_activity&quot;,&quot;inner&quot;:&quot;edit_activity&quot;},&quot;properties&quot;:{&quot;activity_id&quot;:16112144168}},&quot;experiments&quot;:{}}' style=''></div>

<div class='form-group'>
<label for="activity_stats_visibility">Hidden Details</label>

<div class='' data-is-published='' data-react-class='HideStatsInfo' data-react-props='{&quot;experiments&quot;:{}}' style='display: inline-block'></div>

<ul class='hide-stats-container'>
<li>
<input name="activity[stats_visibility][start_time]" type="hidden" value="everyone" autocomplete="off" /><input type="checkbox" value="only_me" name="activity[stats_visibility][start_time]" id="activity_stats_visibility_start_time" />
<label for="activity_stats_visibility_start_time">Start Time</label>
</li>
<li>
<input name="activity[stats_visibility][calories]" type="hidden" value="everyone" autocomplete="off" /><input type="checkbox" value="only_me" name="activity[stats_visibility][calories]" id="activity_stats_visibility_calories" />
<label for="activity_stats_visibility_calories">Calories</label>
</li>
<li>
<input name="activity[stats_visibility][heart_rate]" type="hidden" value="everyone" autocomplete="off" /><input type="checkbox" value="only_me" checked="checked" name="activity[stats_visibility][heart_rate]" id="activity_stats_visibility_heart_rate" />
<label for="activity_stats_visibility_heart_rate">Heart rate</label>
</li>
<li class='pace-stat-checkbox'>
<input name="activity[stats_visibility][pace]" type="hidden" value="everyone" autocomplete="off" /><input type="checkbox" value="only_me" name="activity[stats_visibility][pace]" id="activity_stats_visibility_pace" />
<label for="activity_stats_visibility_pace">Pace</label>
</li>
<li class='speed-stat-checkbox'>
<input name="activity[stats_visibility][speed]" type="hidden" value="everyone" autocomplete="off" /><input type="checkbox" value="only_me" name="activity[stats_visibility][speed]" id="activity_stats_visibility_speed" />
<label for="activity_stats_visibility_speed">Speed</label>
</li>
</ul>
</div>
<div class='form-group'>
<label for="activity_hide_from_home">Mute Activity</label>
<div class='mute-activity'>
<input type="checkbox" value="true" name="activity[hide_from_home]" id="activity_hide_from_home" />
<label for="activity_hide_from_home">Don&#39;t publish to Home or Club feeds</label>
</div>
<small>This activity will still be visible on your profile</small>
</div>
</div>
<div class='col-md-4'>
<div class='row'>
<div class='col-md-12'>
<div class='form-group activity_type'>
<label for="activity_type">Sport</label>
<div class='sport-type-select'><select class="form-control mb-md" name="activity[sport_type]" id="activity_sport_type"><option selected="selected" value="Run">Run</option>
<option value="Ride">Ride</option>
<option value="Swim">Swim</option>
<option value="Walk">Walk</option>
<option value="Hike">Hike</option>
<option value="TrailRun">Trail Run</option>
<option value="MountainBikeRide">Mountain Bike Ride</option>
<option value="GravelRide">Gravel Ride</option>
<option value="EBikeRide">E-Bike Ride</option>
<option value="EMountainBikeRide">E-Mountain Bike Ride</option>
<option value="AlpineSki">Alpine Ski</option>
<option value="Badminton">Badminton</option>
<option value="BackcountrySki">Backcountry Ski</option>
<option value="Canoeing">Canoe</option>
<option value="Crossfit">Crossfit</option>
<option value="Elliptical">Elliptical</option>
<option value="Golf">Golf</option>
<option value="IceSkate">Ice Skate</option>
<option value="InlineSkate">Inline Skate</option>
<option value="Handcycle">Handcycle</option>
<option value="HighIntensityIntervalTraining">HIIT</option>
<option value="Kayaking">Kayaking</option>
<option value="Kitesurf">Kitesurf</option>
<option value="NordicSki">Nordic Ski</option>
<option value="Pickleball">Pickleball</option>
<option value="Pilates">Pilates</option>
<option value="Racquetball">Racquetball</option>
<option value="RockClimbing">Rock Climb</option>
<option value="RollerSki">Roller Ski</option>
<option value="Rowing">Rowing</option>
<option value="Sail">Sail</option>
<option value="Skateboard">Skateboard</option>
<option value="Snowboard">Snowboard</option>
<option value="Snowshoe">Snowshoe</option>
<option value="Soccer">Football (Soccer)</option>
<option value="Squash">Squash</option>
<option value="StandUpPaddling">Stand Up Paddling</option>
<option value="StairStepper">Stair-Stepper</option>
<option value="Surfing">Surfing</option>
<option value="TableTennis">Table Tennis</option>
<option value="Tennis">Tennis</option>
<option value="Velomobile">Velomobile</option>
<option value="WeightTraining">Weight Training</option>
<option value="Windsurf">Windsurf</option>
<option value="Wheelchair">Wheelchair</option>
<option value="Workout">Workout</option>
<option value="Yoga">Yoga</option></select></div>
<div class='form-group ride-workout-types' style='display: none'>
<label for="activity_workout_type">Type of Ride</label>
<select class="form-control mb-md" disabled="disabled" name="activity[workout_type]" id="activity_workout_type"><option value="10"></option>
<option value="11">Race</option>
<option value="12">Workout</option></select>
</div>
<div class='form-group run-workout-types' style='display: none'>
<label for="activity_workout_type">Type of Run</label>
<select class="form-control mb-md" disabled="disabled" name="activity[workout_type]" id="activity_workout_type"><option value="0"></option>
<option value="1">Race</option>
<option value="3">Workout</option>
<option value="2">Long Run</option></select>
</div>
</div>
</div>
</div>
<label>Tags</label>
<fieldset class='activity-tags topless mb-md'>
<div class='inline-inputs marginless'>
<div class='input-field'>
<input name="activity[commute]" type="hidden" value="0" autocomplete="off" /><input type="checkbox" value="1" name="activity[commute]" id="activity_commute" />
<label for="activity_commute"><div class='commute-label'>Commute</div>
</label></div>
<div class='input-field'>
<input name="activity[trainer]" type="hidden" value="0" autocomplete="off" /><input type="checkbox" value="1" name="activity[trainer]" id="activity_trainer" />
<label for="activity_trainer"><div class='trainer-label'>Treadmill</div>
</label></div>
</div>
</fieldset>
<div class='form-group ride-gear' id='gear-bike' style='display: none'>
<label for="activity_bike_id">Bike</label>
<select class="form-control" disabled="disabled" name="activity[bike_id]" id="activity_bike_id"><option value=""></option>
<option value="4572381">B&#39;Twin Hybrid</option></select>
<a class='new-gear ride-gear' href='/settings/gear' style='display: inline-block; margin-top: 20px' target='_blank'>
<div class='gear-label new-ride-gear'>+ New Bike</div>
</a>
</div>
<div class='form-group run-gear' id='gear-run' style='display: none'>
<label for="activity_athlete_gear_id">Shoes</label>
<select class="form-control" disabled="disabled" name="activity[athlete_gear_id]" id="activity_athlete_gear_id"><option value=""></option>
<option selected="selected" value="11904800">Adidas boston 11</option>
<option value="12473505">HOKA Clifton 8</option>
<option value="11827182">Salomon Sense Ride 4</option></select>
<a class='new-gear run-gear' href='/settings/gear' style='display: inline-block; margin-top: 20px' target='_blank'>
<div class='gear-label new-run-gear'>+ New Shoes</div>
</a>
</div>
</div>
</div>
<div class='form-group'>

<div class='' data-is-published='' data-react-class='MediaUploader' data-react-props='{&quot;athleteId&quot;:11694245,&quot;media&quot;:[],&quot;defaultPhotoId&quot;:null,&quot;viewFeatureEdData&quot;:{&quot;is_eligible&quot;:false,&quot;count&quot;:15},&quot;activityId&quot;:16112144168,&quot;experiments&quot;:{}}' style=''></div>

</div>
<input type="submit" name="commit" value="Save" class="btn btn-primary mt-md" data-disable-with="Save" />
</div>
</div>
<div class='col-md-4 stats-col'>
<div class='stats-container'>
<div class='form-group'>
<label for="activity_selected_polyline_style">Map Type</label>

<div class='' data-is-published='' data-react-class='MapTypeInfo' data-react-props='{&quot;experiments&quot;:{}}' style='display: inline-block; margin-top: -2px'></div>

<select class="form-control mb-md" name="activity[selected_polyline_style]" id="activity_selected_polyline_style"><option selected="selected" value="default">Standard</option>
<option disabled="disabled" value="fatmap_satellite_3d">3D</option>
<option disabled="disabled" value="winter_3d">Winter 3D</option>
<option value="surface_type">Dirt</option>
<option disabled="disabled" value="elevation">Elevation</option>
<option disabled="disabled" value="gradient">Gradient</option>
<option disabled="disabled" value="heartrate">Heart Rate</option>
<option disabled="disabled" value="pace">Pace</option>
<option disabled="disabled" value="speed">Speed</option>
<option disabled="disabled" value="temperature">Temperature</option>
<option disabled="disabled" value="time">Time</option>
<option disabled="disabled" value="heatmap">Heatmap</option>
<option value="metro">Strava Metro</option>
<option value="black_lives_matter">Black Lives Matter</option>
<option value="pride">Pride</option>
<option value="ukraine">Support Ukraine</option></select>
</div>
<div class='activity-map mb-sm'>
<img alt='Activity Map' src='https://d3o5xota0a1fcr.cloudfront.net/v6/maps/5EBDAQE5QIWLDFMQEEBSASYWXGPSSWRYPH3MWPFCFAV4U7QLIX5KACU2XRHG2DW4ZR2NJ7D6ZDFMULEEVNND22QJY4U2QYZS5AJA===='>
</div>
<table class='table'>
<tbody>
<tr>
<td>Date</td>
<td>Oct 12, 2025</td>
</tr>
<tr>
<td>Distance</td>
<td>20.01<abbr class='unit' title='kilometers'> km</abbr></td>
</tr>
<tr>
<td>Time</td>
<td>2<abbr class='unit' title='hour'>h</abbr> 6<abbr class='unit' title='minute'>m</abbr></td>
</tr>
<tr>
<td>Elevation Gain</td>
<td>102<abbr class='unit' title='meters'> m</abbr></td>
</tr>
</tbody>
</table>
</div>

</div>
</form></div>
</div>
<script id='bike-dialog' type='text/template'>
<form>
<div class='inline-inputs'>
<span>
<label for='name'>Name</label>
<input id='name' name='name' type='text'>
</span>
</div>
<label>Default Sports</label>
<div class='default-sports'>
<div class='checkbox-group'>
<input type="checkbox" name="ebikeride" id="ebikeride" value="EBikeRide" class="default_sports" />
<label for='ebikeride'>E-Bike Ride</label>
</div>
<div class='checkbox-group'>
<input type="checkbox" name="gravelride" id="gravelride" value="GravelRide" class="default_sports" />
<label for='gravelride'>Gravel Ride</label>
</div>
<div class='checkbox-group'>
<input type="checkbox" name="virtualride" id="virtualride" value="VirtualRide" class="default_sports" />
<label for='virtualride'>Virtual Ride</label>
</div>
<div class='checkbox-group'>
<input type="checkbox" name="handcycle" id="handcycle" value="Handcycle" class="default_sports" />
<label for='handcycle'>Handcycle</label>
</div>
<div class='checkbox-group'>
<input type="checkbox" name="ride" id="ride" value="Ride" class="default_sports" />
<label for='ride'>Ride</label>
</div>
<div class='checkbox-group'>
<input type="checkbox" name="mountainbikeride" id="mountainbikeride" value="MountainBikeRide" class="default_sports" />
<label for='mountainbikeride'>Mountain Bike Ride</label>
</div>
<div class='checkbox-group'>
<input type="checkbox" name="velomobile" id="velomobile" value="Velomobile" class="default_sports" />
<label for='velomobile'>Velomobile</label>
</div>
<div class='checkbox-group'>
<input type="checkbox" name="emountainbikeride" id="emountainbikeride" value="EMountainBikeRide" class="default_sports" />
<label for='emountainbikeride'>E-Mountain Bike Ride</label>
</div>
</div>
<label for='frame_type'>Types</label>
<select name="frame_type" id="frame_type"><option value="3">Road Bike</option>
<option value="1">Mountain Bike</option>
<option value="4">TT Bike</option>
<option value="2">Cross Bike</option>
<option value="5">Gravel Bike</option></select>
<label for='weight'>Weight (kg)</label>
<input class='short' id='weight' name='weight' type='text'>
<label for='brand_name'>Brand</label>
<input class='medium' id='brand_name' name='brand_name' type='text'>
<label for='model_name'>Model</label>
<input class='medium' id='model_name' name='model_name' type='text'>
<label for='notes'>Notes</label>
<textarea class='tall' id='notes' name='notes'></textarea>
<br>
<input type='submit' value='Save Bike'>
</form>
</script>

<div class='hidden'><script id='glossary-template' type='text/template'>
<div class='glossary-header'>
<h3 class='mb-0'>Strava Glossary</h3>
</div>
<div class='glossary-body'>
<div class='btn-group-vertical' role='group'>
<button class='btn btn-default dt' data-glossary-term='definition-suffer-score' role='group' type='button'>
Relative Effort
</button>
<button class='btn btn-default dt' data-glossary-term='definition-perceived-exertion' role='group' type='button'>
Perceived Exertion
</button>
<button class='btn btn-default dt' data-glossary-term='definition-energy-output' role='group' type='button'>
Energy Output
</button>
<button class='btn btn-default dt' data-glossary-term='definition-average-power' role='group' type='button'>
Average Power
</button>
<button class='btn btn-default dt' data-glossary-term='definition-vam' role='group' type='button'>
<abbr title='Vertical ascent in meters/hour'>VAM</abbr>
</button>
<button class='btn btn-default dt' data-glossary-term='definition-intensity' role='group' type='button'>
Intensity
</button>
<button class='btn btn-default dt' data-glossary-term='definition-segment' role='group' type='button'>
Segments
</button>
<button class='btn btn-default dt' data-glossary-term='definition-all-time-prs' role='group' type='button'>
All-time Personal Records
</button>
<button class='btn btn-default dt' data-glossary-term='definition-best-efforts' role='group' type='button'>
Best Efforts
</button>
</div>
<div class='main'></div>
</div>
</script>
<script id='glossary-power-template' type='text/template'>
<div class='glossary-header'>
<h3 class='mb-0'>Strava Glossary</h3>
</div>
<div class='glossary-body'>
<div class='btn-group-vertical' role='group'>
<button class='btn btn-default dt' data-glossary-term='definition-ftp' role='group' type='button'>
<abbr title='Functional Threshold Power'>FTP</abbr>
</button>
<button class='btn btn-default dt' data-glossary-term='definition-calculating-ftp' role='group' type='button'>
Calculating Your FTP
</button>
<button class='btn btn-default dt' data-glossary-term='definition-weighted-average-power' role='group' type='button'>
Weighted Average Power
</button>
<button class='btn btn-default dt' data-glossary-term='definition-total-work' role='group' type='button'>
Total Work
</button>
<button class='btn btn-default dt' data-glossary-term='definition-intensity' role='group' type='button'>
Intensity
</button>
<button class='btn btn-default dt' data-glossary-term='definition-segment-intensity' role='group' type='button'>
Segment Intensity
</button>
<button class='btn btn-default dt' data-glossary-term='definition-training-load' role='group' type='button'>
Training Load
</button>
<button class='btn btn-default dt' data-glossary-term='definition-power-curve' role='group' type='button'>
Power Curve
</button>
<button class='btn btn-default dt' data-glossary-term='definition-power-zones' role='group' type='button'>
Power Zones
</button>
</div>
<div class='main'></div>
</div>
</script>
<script id='glossary-definition-segment-intensity-template' type='text/template'>
<h4>Segment Intensity</h4>
<p>Intensity on Segments gives you a simple visual indication of how hard you went on a given segment by comparing the effort with your best power for the duration of that segment over the last 6 weeks.</p>
<p>For example, if you maintained 300<abbr title='Watts'>W</abbr> for a 10-minute segment and your best 10-minute power over the past 6 weeks was 330W, your segment intensity will be 90%.</p>
</script>
<script id='glossary-definition-ftp-template' type='text/template'>
<h4><abbr title='Functional Threshold Power'>FTP</abbr></h4>
<p>Your Functional Threshold Power (FTP) is the maximum average power that you can hold for one continuous hour. For example, if you were to ride a 40k time trial in 60 minutes at an average power of 275<abbr title='Watts'>W</abbr>, your FTP would be 275W.</p>
<p>FTP is the keystone to training with power. It allows Strava to determine how hard a ride is for you. You doing 300W might feel much different than someone less trained doing 300W and FTP allows us to gauge just how hard segments, rides, and even weeks or months of training were for you!</p>
</script>
<script id='glossary-definition-calculating-ftp-template' type='text/template'>
<h4>Calculating Your FTP</h4>
<p>We recommend you test for your FTP at least every few weeks to a month while you&#39;re training. Here are some tips to get the most out of your FTP testing:</p>
<p>It&#39;s extremely taxing on your body (and your training program) to continuously push out 60-minute max efforts. It&#39;s also difficult to find a stretch of road where you can ride for 60 minutes uninterrupted and maintain a steady wattage. Thus, the easiest way to calculate your FTP is to test your best average power for 20 minutes. We believe 20 minutes is enough time to stress the same physiological systems as a 60-minute effort would and it is easier to consistently do within your season.</p>
<ol>
<li>Try to reproduce the same conditions each test – this means use the same stretch of road or always use the same trainer/rollers</li>
<li>Make sure you are fresh (the previous few days should be light in terms of training load)</li>
<li>Properly warm up</li>
</ol>
</script>
<script id='glossary-definition-weighted-average-power-template' type='text/template'>
<h4>Weighted Average Power</h4>
<p>When you ride with a power meter, you&#39;ll notice how your power jumps all over the place based on the terrain, grade, wind, and other factors. Weighted Average Power looks at all of this variation and provides an average power for your ride that is a better indicator of your effort than simply taking your average power. It is our best guess at your average power if you rode at the exact same wattage the entire ride.</p>
</script>
<script id='glossary-definition-total-work-template' type='text/template'>
<h4>Total Work</h4>
<p>Total Work, expressed in kilojoules (kJ), is simply the sum of the watts generated during your ride. There is a close 1–to–1 ratio with Total Work and Calories expended during a ride.</p>
</script>
<script id='glossary-definition-intensity-template' type='text/template'>
<h4>Intensity</h4>
<p>Intensity is our way of showing how difficult a ride was as compared to your <abbr title ='Functional Threshold Power'>FTP</abbr>. We look at your Weighted Average Power for the ride and compare it to your FTP. If your Weighted Average Power was 250<abbr title='Watts'>W</abbr> and your FTP 300<abbr title='Watts'>W</abbr>, the Intensity would be 83%. It's very possible to have an Intensity of over 100% if the ride was shorter than an hour.</p>
<ul>
<li>Endurance / Recovery Ride – 65% and lower</li>
<li>Moderate Ride – 65-80%</li>
<li>Tempo Ride – 80-95%</li>
<li>Time Trial or Race – 95-105%</li>
<li>Short Time Trial or Race – 105% and higher</li>
</ul>
</script>
<script id='glossary-definition-training-load-template' type='text/template'>
<h4>Training Load</h4>
<p>We calculate Training Load by comparing your power during your ride to your <abbr title='Functional Threshold Power'>FTP</abbr> and determining how much load you put on your body during the workout. Training Load is a great way to determine how much rest you need after your workouts. The guide below will tell you how long after a workout it will take you to fully recover:</p>
<ul>
<li>About 24 hours – 125 and lower</li>
<li>36-48 hours – 125-250</li>
<li>At least 3 days – 250-400</li>
<li>At least 5 days – 400+</li>
</ul>
</script>
<script id='glossary-definition-power-curve-template' type='text/template'>
<h4>Power Curve</h4>
<p>The Power Curve shows your best average power for time periods of 1 second up to the length of your ride. We search your entire ride and find these best efforts and you can compare them with your best efforts for your last 6 weeks, the current year, or years in the past!</p>
<p>The Power Curve can be displayed in Watts (W) or Watts per Kilogram (W/kg.) on your own activity.</p>
</script>
<script id='glossary-definition-power-zones-template' type='text/template'>
<h4>Power Zones</h4>
<p>While the Power Curve shows your best efforts for given periods of time, Power Zone charts take each 1 second of power of your ride and put it into a bucket. The buckets are based on your <abbr title='Functional Threshold Power'>FTP</abbr> and are as follows:</p>
<ol>
<li>Recovery – Social pace with very little physiological effect on your body. Can be used in between intervals and for recovery rides.</li>
<li>Endurance – Easy pace that you could ride “all day long” Conversation is still possible with little concentration required.</li>
<li>Tempo – Brisk pace that can be maintained for a few hours that requires concentration when riding alone. Breathing in tempo is rhythmic and may become strained at the upper end of this zone.</li>
<li>Threshold – Moderate to hard effort and leg fatigue that can be maintained for up to 1 hour. Conversation is difficult and concentration is required.</li>
<li>VO2Max – Power that is primarily taxing your VO2Max system. Leg fatigue is high and conversation is not possible. VO2Max can be maintained for 3-8 minutes.</li>
<li>Anaerobic – Extremely hard efforts with severe leg fatigue that can be maintained for 30 seconds to 3 minutes.</li>
<li>Neuromuscular – Sprinting power that is taxing your neuromuscular system and can be maintained for 1-20 seconds.</li>
</ol>
</script>
<script id='glossary-definition-suffer-score-template' type='text/template'>
<h4>Relative Effort</h4>
<p>Relative Effort is an analysis of your heart rate data. By tracking your heart rate through your workout and its level relative to your maximum heart rate, we attach a value to show exactly how hard you worked. The more time you spend going full gas and the longer your activity, the higher the score. Compare your Relative Effort with friends and pros, see if you can do a truly epic workout and motivate yourself to push that extra bit harder! Relative Effort was inspired by the concept of TRIMP (TRaining IMPulse) coined by Dr. Eric Bannister.</p>
</script>
<script id='glossary-definition-perceived-exertion-template' type='text/template'>
<h4>Perceived Exertion</h4>
<p>Perceived Exertion lets you manually record how intense your efforts feel on a 1-10 scale ranging from “Easy” to “Max Effort.” When tracking how difficult a workout feels overall, Perceived Exertion can stand in for an athlete’s heart rate data. That means Perceived Exertion can power features that otherwise require heart rate data, like Relative Effort and Fitness. Add Perceived Exertion to activities for a layer of qualitative data, or when you happen to forget your heart rate monitor.</p>
</script>
<script id='glossary-definition-energy-output-template' type='text/template'>
<h4>Energy Output</h4>
<p>Energy Output measures the amount of work you&#39;ve done during a ride, expressed in kilojoules (KJ). It is a factor of how much you&#39;re pedaling, how fast you&#39;re pedaling and how much force you&#39;re exerting on the pedals (measured in W). Power output is most accurately taken from a power meter, but if you don&#39;t have a power meter we give a rough approximation through our power estimator.</p>
</script>
<script id='glossary-definition-average-power-template' type='text/template'>
<h4>Average Power</h4>
<p>Average power reflects your average power value during a ride, expressed in Watts (a measure of how much energy you are exerting onto the pedals). This is inclusive of the entire ride, and takes coasting into account as well. Average power is most accurately measured with a power meter, though if you don&#39;t have a power meter we give a rough approximation through our power estimator.</p>
</script>
<script id='glossary-definition-vam-template' type='text/template'>
<h4><abbr title='Vertical ascent in meters/hour'>VAM</abbr></h4>
<p>VAM measures your Vertical Ascent in Meters/hour – it measures how quickly you are traveling upward. VAM is useful for comparing your effort on different hills and segments, and is used by both cyclists and runners. To get a high VAM score, grades between 6-10% generally present the best opportunity to ascend quickly, as they are steep enough to avoid wind, and gradual enough to allow unrestricted motion.</p>
</script>
<script id='glossary-definition-intensity-template' type='text/template'>
<h4>Intensity</h4>
<p>Intensity is a measure that describes running activities on a 10-point scale, with race pace set to 10. The pace used to calculate the intensity takes into account the distance of the run and elevation gained and lost over the run. Now you can instantly gauge how tough your pace is for a run, and see if you&#39;re slowing down enough on your recovery runs.</p>
</script>
<script id='glossary-definition-segment-template' type='text/template'>
<h4>Segments</h4>
<p>A segment is Strava&#39;s term for a specific section of a road, climb or trail. Strava athletes can create segments from their uploaded activities. Strava tracks your performance on each segment every time you run or ride so you can see how you&#39;re progressing over time, and compare your results with other athletes on Strava: your friends, local athletes and even the pros. Start creating segments and see where you land on the leaderboards.</p>
</script>
<script id='glossary-definition-best-efforts-template' type='text/template'>
<h4>Best Efforts</h4>
<p>Best Efforts are calculated using your GPS-based running or cycling activities, and/or cycling activities with power data. Indoor Rides will only count towards power Best Efforts. Strava analyzes the activity to identify the fastest rolling time for benchmark distances, longest activities, activities with most elevation, biggest single climbs and best power outputs at benchmark time intervals. They are considered estimates because they are subject to normal discrepancies in GPS and power meter accuracy.</p>
<p>
How are all-time personal records different from Best Efforts?
</p>
<ul>
<li>All-time personal records are an athlete&#39;s best performance ever in an official race or over a verified, known distance or course.</li>
<li>Best Efforts are training level insights in GPS and power-based activities.</li>
</ul>
<p>Learn more about Best Efforts <a href='https://support.strava.com/hc/en-us/articles/19685360245005-Best-Efforts-Overview'>here</a>.</p>
</script>
<script id='glossary-definition-all-time-prs-template' type='text/template'>
<h4>All-time Personal Records</h4>
<p>All-time Personal Records (PRs) represent an athlete&#39;s fastest time ever run for benchmark distances. PRs are manually entered, and can be linked to official race results and Strava activities.</p>
<p>Whether the PR is from a track, road, or trail race, the PR is often verified by a known time over the race distance. We know that PRs matter down to the second, and we know that GPS data isn&#39;t quite as accurate as a time over a verified race course.</p>
<p>How are All-time Personal Records different from Best Efforts?</p>
<ul>
<li>All-time personal records are an athlete&#39;s best performance ever in an official race or over a verified, known distance or course.</li>
<li>Best Efforts are training level insights in GPS and power-based activities.</li>
</ul>
</script>
</div>

<footer><div class='footer-promos'>
<div class='container'>
<div class='row'>
<div class='promo js-channel-footer-left col-sm-4'>
<h4 class='topless'>Your Recent Activities</h4>
<ul class='list-unstyled recent-activities'>
<li>
<span class="app-icon-wrapper  "><span class="app-icon icon-run icon-dark icon-sm">Run</span></span>
<a class='minimal' href='/activities/16112144168?source=global-footer'>Morning Run</a>
</li>
<li>
<span class="app-icon-wrapper  "><span class="app-icon icon-run icon-dark icon-sm">Run</span></span>
<a class='minimal' href='/activities/16091752994?source=global-footer'>Morning Run</a>
</li>
<li>
<span class="app-icon-wrapper  "><span class="app-icon icon-run icon-dark icon-sm">Run</span></span>
<a class='minimal' href='/activities/16070466158?source=global-footer'>Morning Run</a>
</li>
<li>
<span class="app-icon-wrapper  "><span class="app-icon icon-run icon-dark icon-sm">Run</span></span>
<a class='minimal' href='/activities/16058532887?source=global-footer'>Morning Run</a>
</li>
<li>
<span class="app-icon-wrapper  "><span class="app-icon icon-run icon-dark icon-sm">Run</span></span>
<a class='minimal' href='/activities/16016207224?source=global-footer'>Morning Run</a>
</li>
</ul>
</div>
<div class='promo js-channel-footer-center col-sm-4'>
<h4 class='topless'>Strava Stories</h4>
<p>
With athlete profiles, training tips and advice, and the latest product updates, <a href="https://stories.strava.com">Strava Stories</a> is the place to discover the latest content from Strava.
</p>
</div>
</div>
</div>
</div>
<div class='footer-global container' role='navigation'>
<div class='row'>
<div class='col-sm-2'>
<div title="Return to the Strava home page" class="branding logo-bw"><a class="branding-content" href="/"><span class="sr-only">Strava</span></a></div>
<div class='copyright'>
© 2025 Strava
</div>
</div>
<div class='col-sm-2'>
<h4>About</h4>
<ul class='list-unstyled'>
<li><a href="/about">About</a></li>
<li><a href="/features">Features</a></li>
<li><a href="/mobile">Mobile</a></li>
<li><a href="/subscribe?cta=subscription&amp;element=nav&amp;origin=global_footer&amp;source=global_footer">Subscription</a></li>
<li><a href="/family?origin=global_footer">Family Plan</a></li>
<li><a href="/student?origin=global_footer">Student Discount</a></li>
<li><a href="/subscribe?origin=global_footer#discount-plans">Teacher, Military &amp; Medical Discount (US Only)</a></li>
<li><a href="/gift?origin=global_footer">Send a Gift</a></li>
<li><a href="/legal/privacy">Privacy Policy</a></li>
<li><a href="/legal/cookie_policy">Cookie Policy</a></li>
<li><link rel="preload" href="https://web-assets.strava.com/assets/federated/cpra-compliance-cta-wrapper/remoteEntry.js?t=2025-10-13T09:13:31+00:00" as="script">
<div class='' data-is-published='' data-react-class='Microfrontend' data-react-props='{&quot;scope&quot;:&quot;strava_cpra_compliance_cta_wrapper&quot;,&quot;url&quot;:&quot;https://web-assets.strava.com/assets/federated/cpra-compliance-cta-wrapper/remoteEntry.js?t=2025-10-13T09:13:31+00:00&quot;,&quot;component&quot;:&quot;./CPRAComplianceCTAWrapper&quot;,&quot;appContext&quot;:{&quot;isLoggedIn&quot;:true},&quot;experiments&quot;:{}}' style=''></div>
</li>
<li><a href="/legal/terms">Terms</a></li>
<li><a href="https://support.strava.com/hc/en-us/articles/216917717-About-Strava-Maps">About Our Maps</a></li>
</ul>
</div>
<div class='col-sm-2'>
<h4>Explore</h4>
<ul class='list-unstyled'>
<li><a href="/routes/hiking/usa">Routes</a></li>
</ul>

</div>
<div class='col-sm-2'>
<h4>Follow</h4>
<ul class='list-unstyled'>
<li><a target="_blank" href="http://www.facebook.com/Strava">Facebook</a></li>
<li><a target="_blank" href="http://twitter.com/strava">Twitter</a></li>
<li><a target="_blank" href="http://instagram.com/strava">Instagram</a></li>
<li><a target="_blank" href="http://www.youtube.com/stravainc">YouTube</a></li>
<li><a target="_blank" href="https://www.linkedin.com/company/strava-inc./">LinkedIn</a></li>
<li><a href="https://stories.strava.com">Stories</a></li>
</ul>
</div>
<div class='col-sm-2'>
<h4>Help</h4>
<ul class='list-unstyled'>
<li><a href="https://strava.zendesk.com/home">Strava Support</a></li>
</ul>

</div>
<div class='col-sm-2'>
<h4>More</h4>
<ul class='list-unstyled'>
<li><a href="/careers">Careers</a></li>
<li><a href="https://press.strava.com">Press</a></li>
<li><a href="https://partners.strava.com/business?utm_source=footer&amp;utm_medium=referral">Business</a></li>
<li><a href="https://partners.strava.com">Partner Center</a></li>
<li><a href="http://labs.strava.com/developers">Developers</a></li>
<li><a href="http://labs.strava.com">Labs</a></li>
<li><a href="/community-standards">Strava Community Standards</a></li>
</ul>
<div class='dropdown drop-down-menu drop-down-xs' id='language-picker'>
<button class='btn btn-default btn-xs dropdown-selection btn-white selection'>English (US)</button>
<ul class='options dropdown-menu anchor-right anchor-bottom'>
<li>
<div class='replace-selection clickable language-pick' language-code='id-ID'>Bahasa Indonesia</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='en-GB'>British English</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='de-DE'>Deutsch</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='en-US'>English (US)</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='es-ES'>español</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='es-419'>español latinoamericano</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='fr-FR'>français</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='it-IT'>italiano</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='nl-NL'>Nederlands</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='pt-PT'>português</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='pt-BR'>português do Brasil</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='ru-RU'>русский</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='ja-JP'>日本語</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='zh-CN'>简体中文</div>
</li>
<li>
<div class='replace-selection clickable language-pick' language-code='zh-TW'>繁體中文</div>
</li>
</ul>
</div>

</div>
</div>
</div>
<a id="back-to-top" class="media-sm-show visible-sm-block" href="#">Top ↑</a>
</footer>


<script id='lightbox-template' type='text/template'>
<div class='lightbox-window modal-content'>
<div class='close-lightbox'>
<button class='btn btn-unstyled btn-close'>
<div class='app-icon icon-close icon-xs icon-dark'></div>
</button>
</div>
</div>
</script>
<script id='popover-template' type='text/template'>
<div class='popover'></div>
</script>
<script>
  window._asset_host = "https://d3nn82uaxijpm6.cloudfront.net";
 window._measurement_preference = "meters";
 window._date_preference = "%m/%d/%Y";
 window._datepicker_preference_format = "mm/dd/yy";

 jQuery(document).ready(function() {
   Strava.Util.EventLogging.createInstance("https://analytics.strava.com","7215fa60b5f01ecc3967543619f7e3d9", 11694245);
 });
</script>
<script src="https://d3nn82uaxijpm6.cloudfront.net/assets/strava/i18n/locales/en-US-3599fc782dab39bc0a338dd431bb61a539b61785e30959f67f12dcf2728f724c.js"></script>
<script src="https://d3nn82uaxijpm6.cloudfront.net/assets/application-b10bd4adc0ff83924a2310de2e0cffb1895fd9f8dda4ddfa2b6e47c19296b579.js"></script>

<script src="https://www.strava.com/cookie-banner"></script>
<script>
  jQuery(function() {
   if (typeof StravaCookieBanner !== 'undefined') {
     StravaCookieBanner.render();
   }
 });
</script>


<div id='fb-root'></div>
<script>
  // set fbInitialized so we know FB is being initialized async (safegaurd against react loading FB twice)
 if (window.Strava) window.Strava.fbInitialized = true;
 window.fbAsyncInit = function() {
   FB.init({
     appId: "284597785309",
     status: true,
     cookie: true,
     xfbml: true,
     version: "v7.0"
   });
   Strava.Facebook.PermissionsManager.getInstance().facebookReady();
   jQuery('#fb-root').trigger('facebook:init');
 };
 (function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   ref.parentNode.insertBefore(js, ref);
 }(document));
</script>


<script>
  var currentAthlete = new Strava.Models.CurrentAthlete({"id":11694245,"logged_in":true,"display_name":"Nishanth Murugan","first_name":"Nishanth","last_name":"Murugan","premium":false,"has_power_analysis_access":false,"photo_large":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/11694245/6242157/12/large.jpg","photo":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/11694245/6242157/12/large.jpg","badge":null,"measurement_preference":"meters","weight_measurement_unit":"kg","type":1,"member_type":"","display_location":"Coimbatore, Tamil Nadu, India","gender":"M","geo":{"city":"Coimbatore","state":"Tamil Nadu","country":"India","lat_lng":[11.002026,76.973712]},"has_leaderboards_access":false,"has_pace_zone_analysis_access":false,"is_segments_restricted":true,"is_trial_eligible":true});
 HAML.globals = function() {
   return {
     currentAthlete: currentAthlete,
     renderPartial: function(name, context) {
       if (context == null) {
         context = this;
       }
       return JST[name](context);
     }
   }
 }
</script>

<script>
  new Strava.Initializer();
</script>
<script src="https://d3nn82uaxijpm6.cloudfront.net/assets/strava/activities/edit/manifest-9878df8a62a1d5a7a102836a21a64581c98e306c49c8227b67802cabc8e515ed.js"></script>
<script>
  jQuery(document).ready(function() {
   var dynamicStrings = {
     indoor: {
       ride: 'Indoor Cycling',
       run: 'Treadmill',
       other: 'Indoor'
     },
     gear: {
       ride: '+ New Bike',
       run: '+ New Shoes'
     }
   };

   var editView = new Strava.Activities.EditView({
     el: jQuery('.edit-form'),
     sportType: 'Run',
     dynamicStrings: dynamicStrings,
     athleteId: 11694245,
     usesShoesTypeNames: ["Hike","Run","Walk","VirtualRun"],
     usesBikeTypeNames: ["Ride","VirtualRide","EBikeRide","Velomobile","Handcycle"],
     legacyActivityTypeMapping: {"Crossfit":"Crossfit","EBikeRide":"EBikeRide","Canoeing":"Canoeing","IceSkate":"IceSkate","Hike":"Hike","AlpineSki":"AlpineSki","Kitesurf":"Kitesurf","Racquetball":"Workout","GravelRide":"Ride","VirtualRide":"VirtualRide","RollerSki":"RollerSki","Snowboard":"Snowboard","Soccer":"Soccer","VirtualRow":"Rowing","Swim":"Swim","Pickleball":"Workout","Handcycle":"Handcycle","Snowshoe":"Snowshoe","StandUpPaddling":"StandUpPaddling","Ride":"Ride","RockClimbing":"RockClimbing","TableTennis":"Workout","Workout":"Workout","MountainBikeRide":"Ride","VirtualRun":"VirtualRun","Walk":"Walk","StairStepper":"StairStepper","BackcountrySki":"BackcountrySki","Run":"Run","Elliptical":"Elliptical","WeightTraining":"WeightTraining","Velomobile":"Velomobile","ClassicNordicSki":"NordicSki","Tennis":"Workout","Squash":"Workout","SkateNordicSki":"NordicSki","Kayaking":"Kayaking","TrailRun":"Run","EMountainBikeRide":"EBikeRide","Golf":"Golf","Surfing":"Surfing","Skateboard":"Skateboard","Sail":"Sail","HighIntensityIntervalTraining":"Workout","Windsurf":"Windsurf","InlineSkate":"InlineSkate","NordicSki":"NordicSki","Wheelchair":"Wheelchair","Pilates":"Workout","Badminton":"Workout","Rowing":"Rowing","Yoga":"Yoga"}
   });

   jQuery('button.btn-save-activity').on('click', function(){
     jQuery('#edit-activity input[type="submit"]').click();
   });

   // Override the normal error state. Until we have a specific error template
   // for this UI, simply don't show anything when a user uploads an unsupported
   // file.  TODO add one!
   Dropzone.options.photoUploader.error = function(file, message, xhr){
     var previewElement = jQuery(file.previewElement);
     previewElement.closest('.dz-file-preview').remove();
   };
   Dropzone.options.photoUploader.previewsContainer = '.dropzone';
   Dropzone.options.photoUploader.previewTemplate = JST['activities/edit/photo_preview']();
   Dropzone.options.photoUploader.athleteId = 11694245;
 });
</script>
<script>
  jQuery(document).ready(function() {
   Strava.ExternalAnalytics.trackV2({
     category: 'edit_activity',
     page: 'edit_activity',
     action: 'screen_enter',
     properties: {
       activity_id: "16112144168"
     }
   });
 });

 window.addEventListener('beforeunload', function () {
   Strava.ExternalAnalytics.trackV2({
     category: 'edit_activity',
     page: 'edit_activity',
     action: 'screen_exit',
     properties: {
       activity_id: "16112144168"
     }
   });
 });
</script>
<script>
  if ('serviceWorker' in navigator) {
   window.addEventListener('load', function() {
     navigator.serviceWorker.register("/service_worker.js?v=dLlWydWlG8").then(function(registration) {
     }, function(err) {
       console.log('ServiceWorker registration failed: ', err);
     });
   });
 }
</script>
<script>
  jQuery(document).ready(function() {
   // Scroll Tracking
   jQuery(document).one('scroll', function(){
     Strava.ExternalAnalytics.trackV2({
       category: 'page_scrolled'
     });
   });
 });
</script>
<script>
  jQuery(document).ready(function($) {
     new Strava.GlobalSearch.SearchFieldController(currentAthlete);
 });

 jQuery(document).ready(function() {
   jQuery('#global-search-button').on('click', function() {
     const $globalSearchField = jQuery('#global-search-field');
     const searchText = $globalSearchField.val();
     const searchType = $globalSearchField.data('search-filter');

     Strava.ExternalAnalytics.trackV2({
       category: 'search',
       page: 'search',
       action: 'execute_search',
       properties: {
         'search_type': searchType,
         'search_text': searchText
       }
     });
   });

   jQuery('#global-search-field').on('keypress', function(e) {
     const searchText = jQuery(this).val();
     const searchType = jQuery(this).data('search-filter');

     // When user presses enter, track the search
     if (e.which == 13) {
       Strava.ExternalAnalytics.trackV2({
         category: 'search',
         page: 'search',
         action: 'execute_search',
         properties: {
           'search_type': searchType,
           'search_text': searchText
         }
       });
     }
   });
 });
</script>
<script>
  // grabs placeholder spacing to remove when microfrontend is finished loading
 var notifsPlaceholder = document.getElementById('notifications-loading-placeholder');
 document.addEventListener('notificationsReady', function() {
   notifsPlaceholder.remove();
 });
</script>
<script>
  // Mobile Menu transition handler
 jQuery('.collapsable-nav #container-nav')
   .on('show.bs.collapse', function(){
     jQuery('#smartbanner-loading-placeholder').slideUp(100);
     jQuery('html').addClass('mobile-menu-open');
   })
   .on('hidden.bs.collapse', function(){
     jQuery('#smartbanner-loading-placeholder').slideDown(100);
     jQuery('html').removeClass('mobile-menu-open');
   });
</script>
<script>
  // Dismiss function for alert messages
 jQuery('document').ready(function(){
   var dismissController = new Strava.Util.DismissController("/dashboard/dismiss_ui");
   jQuery('.message').on('click', '.dismiss', function(){
     dismissController.dismiss("");
     jQuery(this).parents('.message').slideUp('fast');
   });

   // check for internet explorer and show banner
   var userAgent = window.navigator.userAgent;
   if (userAgent.includes('Trident') || userAgent.includes('MSIE')) {
     jQuery('#ie-deprecation-message').removeClass('hidden');
   }
 });
</script>
<script>
  jQuery(document).ready(function() {
   new Strava.Util.DropDownMenu('.drop-down-menu')
   jQuery('.language-pick').each(function(index) {
     jQuery( this ).click(function() {
       language = jQuery( this ).attr('language-code');
       expiration = new Date();
       expiration.setTime(expiration.getTime() + (1825 * 24 * 60 * 60 * 1000));
       // Reset any previously set cookie for this page
       document.cookie = 'ui_language= ; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
       // Set a global cookie
       document.cookie = 'ui_language=' + language + '; expires=' + expiration + '; path=/';
       location.reload(true);
     });
   });
 });
</script>
<script>
  jQuery(document).ready(function() {
   jQuery('#explore-strava, #challenge-list-view, .promo-simple, .promo-fancy, .promo-overlay, .sponsor-link-section, .sponsor').on('click', 'a', function(event) {
     var link = jQuery(event.target).closest('a');
     var adzerkClickUri = link.data('adzerk-click-uri');
     if (adzerkClickUri != null) {
       jQuery.get(adzerkClickUri); // this is fire-and-forget - we don't need to wait for a successful response from Adzerk
     }
   });
 });
</script>

<script src="https://d3nn82uaxijpm6.cloudfront.net/assets/bootstrap.min-504d59678f10d79a661b6cecdce5b8c1d5bfd98e860614584c0a40399552d61f.js"></script>

</body>
</html>
