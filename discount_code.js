this.getDiscountData =  function(discountCode) {
    if (discountCode === undefined) {
      return;
    }
    var query = new URLSearchParams({
      discount: discountCode
    });

    return fetch("/checkout?".concat(query)).then(function (response) {
      return response.text();
    }).then(function (html) {
      var parser = new DOMParser();
      var newDoc = parser.parseFromString(html, 'text/html');
      var $ = newDoc.querySelector.bind(newDoc);
      var discountType = $('.total-line.total-line--reduction');
      discountType = discountType && discountType.dataset && discountType.dataset.discountType;
      var CDAT = $('tr.total-line--reduction td.total-line__price .order-summary__emphasis');

      CDAT = CDAT && CDAT.dataset && CDAT.dataset.checkoutDiscountAmountTarget;
      var CPDT = $('.payment-due__price');
      CPDT = CPDT && CPDT.dataset && CPDT.dataset.checkoutPaymentDueTarget;
      var totalText = $('.payment-due-label__total');
      totalText = totalText && totalText.innerText || 'Total';
      var discountText = $('.total-line__name span');
      discountText = discountText && discountText.innerText || 'Discount';

      var error = $('#error-for-reduction_code');
      if (error != null) {
          return {
            discountType: 'error',
            checkoutDiscountAmountTarget: 0,
            checkoutPaymentDueTarget: 0,
            discountText: 'error',
            totalText: 'error'
          };
      }


      return {
        discountType: discountType,
        checkoutDiscountAmountTarget: CDAT,
        checkoutPaymentDueTarget: CPDT,
        discountText: discountText,
        totalText: totalText
      };
    }).catch(console.error);
  }
