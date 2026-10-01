window.initVerdeAddressAutocomplete = function () {
  const input = document.getElementById('property-address');
  if (!input || !window.google || !google.maps || !google.maps.places) return;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ['formatted_address'],
    types: ['address'],
    componentRestrictions: { country: 'us' }
  });

  autocomplete.addListener('place_changed', function () {
    const place = autocomplete.getPlace();
    if (place && place.formatted_address) {
      input.value = place.formatted_address;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
};
