window.optly.mrkt.form = window.optly.mrkt.form || {};

var createAccountHelper = {

  scrollTopDialog: function() {
    if(document.body.classList.contains('oform-error')) {
      var dialog = this.dialogElm.querySelector('.dialog'),
        scrollAmt = dialog.scrollTop,
        callee = this.scrollTopDialog;

      if(scrollAmt !== 0) {
        dialog.scrollTop = (scrollAmt - 10);
        if(window.requestAnimationFrame) {
          window.requestAnimationFrame(callee.bind(this));
        } else {
          dialog.scrollTop = 0;
        }
      }
    }
  },

  scrollTopCta: function(ctaId) {
    if(document.body.classList.contains('oform-error')) {
      var target = document.getElementById(ctaId);

      $('html,body').animate({
        scrollTop: $(target).offset().top
      }, 1000);
    }
  },

  passwordConfirm: function(password1, password2){
    var password2ErrorElm = this.formElm.querySelector('.password2-related'),
      message = 'ENTER_SAME_VAL';

    if ( password2.value.length > 0 && password1.value !== password2.value ) {
      this.addErrors([password2, password2ErrorElm]);
      this.customErrorMessage(password2ErrorElm, {error: message});
    }
    //remove local error classes but do not remove body error class just in case
    else {
      this.passed = true;
      this.removeErrors([password2, password2ErrorElm]);
    }
  },

  passwordKeyupValid: function() {
    var password1 = this.formElm.querySelector('[name="password1"]'),
      password2 = this.formElm.querySelector('[name="password2"]'),
      password2ErrorElm = this.formElm.querySelector('.password2-related');

    // password1 validations
    $(password1).on('focusout', function() {
      if( password1.value.length > 0 && !w.optly.mrkt.utils.checkComplexPassword(password1.value) ){
        this.addErrors([password1, this.characterMessageElm]);
      } else {
        this.removeErrors([password1, this.characterMessageElm]);
        this.passed = true;
      }

      $(password1).on('focusin', function() {
        this.removeErrors([password1, this.characterMessageElm], true);
      }.bind(this));

    }.bind(this));

    //password2 confirmation
    $(password2).on('focusout', function() {
      this.passwordConfirm(password1, password2);
      $(password2).on('focusin', function() {
        this.removeErrors([password2, password2ErrorElm], true);
      }.bind(this));
    }.bind(this));
  },

  password1Validate: function(elm) {
    var validationPassed = w.optly.mrkt.utils.checkComplexPassword(elm.value),
      errorElm = this.formElm.getElementsByClassName('password1-related')[0],
      message;

    if(!validationPassed) {
      if(elm.value.length === 0) {
        message = 'REQUIRED_FIELD';
      } else {
        message = 'INVALID_PASSWORD';
      }
      this.characterMessageElm.classList.add('error-show');
      this.customErrorMessage(errorElm, {error: message});
    } else if (validationPassed && this.characterMessageElm.classList.contains('error-show')) {
      this.characterMessageElm.className = this.characterMessageElm.classList.remove('error-show');
    }

    return validationPassed;
  },

  password2Validate: function(elm) {
    var password1 = this.formElm.querySelector('[name="password1"]'),
      errorElm = this.formElm.getElementsByClassName('password2-related')[0],
      validationPassed = elm.value === password1.value && w.optly.mrkt.utils.checkComplexPassword(password1.value),
      message;
    if (!validationPassed) {
      if (elm.value.length === 0) {
        message = 'REQUIRED_FIELD';
      } else if (elm.value !== password1.value) {
        message = 'ENTER_SAME_VAL';
      }
      this.customErrorMessage(errorElm, {error: message});
    }

    return validationPassed;
  },

  load: function(e) {
    var resp = this.parseResponse(e),
      formElm = this.formElm;

    if(resp) {
      w.optly.mrkt.Oform.trackLead({
        name: formElm.querySelector('[name="name"]').value || '',
        email: formElm.querySelector('[name="email"]').value || '',
        phone: formElm.querySelector('[name="phone_number"]').value || '',
        Web__c: $('input[type="checkbox"][name="web"]').is(':checked') + '',
        Mobile_Web__c: $('input[type="checkbox"][name="mobile_web"]').is(':checked') + '',
        iOS__c: $('input[type="checkbox"][name="ios"]').is(':checked') + '',
        Android__c: $('input[type="checkbox"][name="android"]').is(':checked') + ''
      }, e);

      this.redirectHelper({
        redirectPath: '/welcome',
        bodyClass: 'signed-in'
      });
    }

  },

  loadAnonymousWall: function(e) {
    var resp = this.parseResponse(e);

    if (resp) {
      var plan = resp.plan ? resp.plan : 'null';

      w.analytics.identify(resp.unique_user_id, {
        Email: resp.email,
        Last_Experiment_URL__c: $('#url-input').val(),
        LastExperimentCreatedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        ExperimentsCreated: '1',
        FirstName: resp.first_name,
        LastName: resp.last_name,
        Phone: resp.phone_number,
        otm_Medium__c: w.optly.mrkt.source.otm.medium,
        utm_Medium__c: w.optly.mrkt.source.utm.medium,
        Web__c: $('input[type="checkbox"][name="web"]').is(':checked') + '',
        Mobile_Web__c: $('input[type="checkbox"][name="mobile_web"]').is(':checked') + '',
        iOS__c: $('input[type="checkbox"][name="ios"]').is(':checked') + '',
        Android__c: $('input[type="checkbox"][name="android"]').is(':checked') + ''
      },
      { integrations: { Marketo: true } });

      w.Munchkin.munchkinFunction('visitWebPage', {
        url: '/event/customer/signedin'
      });
      w.Munchkin.munchkinFunction('visitWebPage', {
        url: '/event/account/signin'
      });
      w.Munchkin.munchkinFunction('visitWebPage', {
        url: '/event/plan/' + plan
      });

      w.analytics.page('/account/create/success');
      w.analytics.track('/account/create/success');
      w.analytics.track('account created', {
        category: 'account',
        label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      }, {
        integrations: {
          Marketo: false
        }
      });

      w.analytics.page('/account/signin');
      w.analytics.track('account sign-in', {
        category: 'account',
        label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      }, {
        integrations: {
          Marketo: false
        }
      });

      w.analytics.page('/customer/signedin');
      w.analytics.track('customer sign in', {
        category: 'account',
        label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      }, {
        integrations: {
          Marketo: false
        }
      });
      w.analytics.page('/plan/' + plan);
    }

    w.setTimeout(function() {
      var inputVal = $('#test-it-out-form input[type="text"]').val();
      w.optly.mrkt.index.testItOut( inputVal );
    }, 500);
  },

  pricingSignupSuccess: function(event, data){
    var resp = this.parseResponse(data.event),
      plan;

    if(resp){

      document.body.classList.add('create-account-success');

      w.analytics.identify(resp.unique_user_id, {
        Email: resp.email,
        Last_Experiment_URL__c: data.data['url-input'],
        LastExperimentCreatedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        ExperimentsCreated: '1',
        FirstName: resp.first_name || '',
        LastName: resp.last_name || '',
        otm_Medium__c: w.optly.mrkt.source.otm.medium || '',
        utm_Medium__c: w.optly.mrkt.source.utm.medium || '',
        Web__c: $('input[type="checkbox"][name="web"]').is(':checked') + '',
        Mobile_Web__c: $('input[type="checkbox"][name="mobile_web"]').is(':checked') + '',
        iOS__c: $('input[type="checkbox"][name="ios"]').is(':checked') + '',
        Android__c: $('input[type="checkbox"][name="android"]').is(':checked') + ''
      }, {
        integrations: {Marketo: true}
      });

      plan = resp.plan ? resp.plan : 'null';

      w.Munchkin.munchkinFunction('visitWebPage', {
        url: '/event/pricing/account/create/success'
      });
      w.analytics.track('/event/pricing/account/create/success', {}, { Marketo: true });

      w.Munchkin.munchkinFunction('visitWebPage', {
        url: '/event/customer/signedin'
      });
      w.Munchkin.munchkinFunction('visitWebPage', {
        url: '/event/account/signin'
      });
      w.Munchkin.munchkinFunction('visitWebPage', {
        url: '/event/plan/' + plan
      });

      w.analytics.page('/account/create/success');
      w.analytics.track('/account/create/success');
      w.analytics.track('account created', {
        category: 'account',
        label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      });

      w.analytics.page('/account/signin');
      w.analytics.track('account sign-in', {
        category: 'account',
        label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      });

      w.analytics.page('/customer/signedin');
      w.analytics.track('customer sign in', {
        category: 'account',
        label: w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
      });
      w.analytics.page('/plan/' + plan);

      //change the user's plan to free to get them started
      w.optly.mrkt.changePlanHelper.changePlan({
        plan: 'free_light',
        callback: function(){
            //show confirmation
            //w.optly.mrkt.modal.open({ modalType: 'pricing-plan-signup-thank-you' });
            w.location = 'https://www.optimizely.com/welcome';
        },
        load: w.optly.mrkt.changePlanHelper.load
      });

    }
  }

};

window.optly.mrkt.form.createAccount = function(argumentsObj) {
  var constructorArgs = {
    formId: argumentsObj.formId,
    dialogId: argumentsObj.dialogId,
    characterMessageSelector: '.password-req',
    init: 'passwordKeyupValid',
    prototype: createAccountHelper
  };

  return window.optly.mrkt.form.HelperFactory(constructorArgs);

};
