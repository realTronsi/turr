export function getSvgViewBox(svgDoc) {
   if (svgDoc) {
      // Get viewBox from SVG doc.
      let viewBox = $(svgDoc).find('svg').prop('viewBox').baseVal;

      // Have viewBox?
      if (viewBox) {
         return {
            width: viewBox.width,
            height: viewBox.height
         }
      }
   }

   // If here, no viewBox found so return null case.
   return {
      width: null,
      height: null
   }
}

export function svgDocToDataURL(svgDoc, base64) {
   // Set SVG prefix.
   const svgPrefix = "data:image/svg+xml;";

   // Serialize SVG doc.
   var svgData = new XMLSerializer().serializeToString(svgDoc);

   // Base64? Return Base64-encoding for data URL.
   if (base64) {
      var base64Data = btoa(svgData);
      return svgPrefix + "base64," + base64Data;

   // Nope, not Base64. Return URL-encoding for data URL.
   } else {
      var urlData = encodeURIComponent(svgData);
      return svgPrefix + "charset=utf8," + urlData;
   }
}