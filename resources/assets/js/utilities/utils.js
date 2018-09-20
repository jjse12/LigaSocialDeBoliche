import moment from 'moment';

export default {
  lstNums:  ()=>{
    let lst=1;
    for(let i=2; i < 33; i++){
      lst= lst + ","+i;
    }
    return lst;
  },

  getDateTime:  () =>{
    let dt="";
    const date= new Date();
    const day = date.getDate();
    const month = (date.getMonth())+1;
    const year = date.getFullYear();
    const hours= date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    dt=month + "-" + day + "-" + year + " | " + hours + ":" + minutes + ":" + seconds;

    return dt;
  },

  cleanHeaders:  (jsonObject) =>{
    let descHdr="";
    let cleanHdrs=[];

    for (let h=0; h < jsonObject.length; h++) {
      descHdr=jsonObject[h];
      descHdr=descHdr.trim();
      cleanHdrs=cleanHdrs.concat(descHdr);
    }
    return cleanHdrs;
  },

  //SVG animation for Wait Layer
  svgAnimation:  () => {
    let svg = "<svg version=\"1.1\" id=\"L7\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\" x=\"0px\" y=\"0px\"";
    svg += "                 viewBox=\"0 0 100 100\" enable-background=\"new 0 0 100 100\" xml:space=\"preserve\">";
    svg += "                    <path fill=\"#fff\" d=\"M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z\">";
    svg += "                        <animateTransform";
    svg += "                                attributeName=\"transform\"";
    svg += "                                attributeType=\"XML\"";
    svg += "                                type=\"rotate\"";
    svg += "                                dur=\"2s\"";
    svg += "                                from=\"0 50 50\"";
    svg += "                                to=\"360 50 50\"";
    svg += "                                repeatCount=\"indefinite\" \/>";
    svg += "                    <\/path>";
    svg += "                <path fill=\"#fff\" d=\"M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z\">";
    svg += "                    <animateTransform";
    svg += "                            attributeName=\"transform\"";
    svg += "                            attributeType=\"XML\"";
    svg += "                            type=\"rotate\"";
    svg += "                            dur=\"1s\"";
    svg += "                            from=\"0 50 50\"";
    svg += "                            to=\"-360 50 50\"";
    svg += "                            repeatCount=\"indefinite\" \/>";
    svg += "                <\/path>";
    svg += "                <path fill=\"#fff\" d=\"M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5L82,35.7z\">";
    svg += "                    <animateTransform";
    svg += "                            attributeName=\"transform\"";
    svg += "                            attributeType=\"XML\"";
    svg += "                            type=\"rotate\"";
    svg += "                            dur=\"2s\"";
    svg += "                            from=\"0 50 50\"";
    svg += "                            to=\"360 50 50\"";
    svg += "                            repeatCount=\"indefinite\" \/>";
    svg += "                <\/path>";
    svg += "            <\/svg>";
    return svg;
  },


  noCapsNoSpaces: (strng)=>{
    const specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,._";
    for (let i = 0; i < specialChars.length; i++) {
      strng= strng.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
    }
    strng = strng.toLowerCase();
    strng = strng.replace(/ /g,"");
    strng = strng.replace(/á/gi,"a");
    strng = strng.replace(/é/gi,"e");
    strng = strng.replace(/í/gi,"i");
    strng = strng.replace(/ó/gi,"o");
    strng = strng.replace(/ú/gi,"u");
    strng = strng.replace(/ñ/gi,"n");
    return strng;
  },

  fromArrayToKeyValue:  array => {
    //Clean Headers. Erasing white spaces.
    const headers = array[0].map(element => element.trim());
    const data = array.slice(1);
    return data
      .filter(element => element.length == headers.length) // filter rows with unmatching data
      .map(row => {
        return row.reduce((prevState, element, index) => {
          prevState[headers[index]] = element;
          return prevState;
        }, {});
      });
  },

  camelCaseToHuman:  (camelCase) => {
    const result = camelCase.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_]/g, '');
    return result.charAt(0).toUpperCase() + result.substring(1);
  },

  dateFormat: dateString => {
    const date = moment(new Date(dateString));
    return date.format('YYYY-MM-DD HH:mm:ss');
  },

  isDate: dateString => typeof dateString === 'string' && dateString.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z/) !== null,

  getParentPath: path => path.split('/').slice(0, -1).join('/'),

  getItemByKey: (list, key, value) => {
    if (!list || !Array.isArray(list)) {
      return undefined;
    }
    return list
      .map((item, index) => ({index, item}))
      .filter(({ item }) => item[key] === value)[0];
  }
};
