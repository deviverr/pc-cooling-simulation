// Manufacturer figures are reference data, not measured draw. Geometry profiles
// remain editable and are not exact vendor CAD. Sources were checked 2026-10-15.
export const cpus=[
 {id:'custom',name:'Custom CPU',heat:65,budget:100,socket:'custom',note:'Enter your own package heat and power budget.'},
 {id:'eco35',name:'Efficient / 35 W class',heat:35,budget:55,socket:'custom'},
 {id:'main65',name:'Mainstream / 65 W class',heat:65,budget:100,socket:'custom'},
 {id:'performance125',name:'Performance / 125 W class',heat:125,budget:200,socket:'custom'},
 {id:'workstation220',name:'Workstation / 220 W class',heat:220,budget:300,socket:'custom'},
 {id:'9700x',name:'AMD Ryzen 7 9700X · 65 W TDP',heat:65,budget:100,socket:'AM5',source:'https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9700x.html',note:'65 W is AMD default TDP, not measured electrical draw. The 100 W budget is an editable planning assumption.'},
 {id:'9900x',name:'AMD Ryzen 9 9900X · 120 W TDP',heat:120,budget:170,socket:'AM5',source:'https://www.amd.com/en/partner/articles/ryzen-9000-series-processors.html',note:'120 W default TDP; 170 W planning budget is an assumption.'},
 {id:'9950x',name:'AMD Ryzen 9 9950X · 170 W TDP',heat:170,budget:230,socket:'AM5',source:'https://www.amd.com/en/partner/articles/ryzen-9000-series-processors.html',note:'170 W default TDP; 230 W planning budget is an assumption.'},
 {id:'265k',name:'Intel Core Ultra 7 265K',heat:125,budget:250,socket:'LGA1851',source:'https://www.intel.co.uk/content/www/uk/en/gaming/overclocking-intel-processors.html',note:'Intel lists 125 W processor base power and 250 W maximum turbo power.'}
];
export const gpus=[
 {id:'custom',name:'Custom graphics card',kind:'large',heat:180,length:300,slots:3,connector:'2x8'},
 {id:'igpu',name:'Integrated graphics · no card',kind:'none',heat:0,length:0,slots:0,connector:'none'},
 {id:'slot75',name:'Slot-powered compact · 75 W class',kind:'small',heat:75,length:180,slots:2,connector:'none'},
 {id:'compact160',name:'Compact dual-fan · 160 W class',kind:'small',heat:160,length:230,slots:2,connector:'1x8'},
 {id:'triple250',name:'Triple-fan performance · 250 W class',kind:'large',heat:250,length:300,slots:3,connector:'2x8'},
 {id:'5070',name:'NVIDIA RTX 5070 · 250 W reference',kind:'large',heat:250,length:280,slots:2.5,connector:'16',source:'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/'},
 {id:'5070ti',name:'NVIDIA RTX 5070 Ti · 300 W reference',kind:'large',heat:300,length:330,slots:3,connector:'16',source:'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/'},
 {id:'9070xt',name:'AMD RX 9070 XT · 304 W reference',kind:'large',heat:304,length:330,slots:3,connector:'2x8',source:'https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html'},
 {id:'5080',name:'NVIDIA RTX 5080 · 360 W reference',kind:'large',heat:360,length:330,slots:3,connector:'16',source:'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5080/'},
 {id:'extreme450',name:'Enthusiast quad-slot · 450 W class',kind:'large',heat:450,length:355,slots:4,connector:'16'}
];
export const coolers=[
 {id:'stock',name:'Stock radial cooler',kind:'stock',height:65,radiator:0},
 {id:'low',name:'Low-profile downdraft',kind:'stock',height:47,radiator:0},
 {id:'tower',name:'120 mm single-tower',kind:'tower',height:155,radiator:0},
 {id:'dualTower',name:'Dual-tower air cooler',kind:'tower',height:168,radiator:0},
 {id:'aio120',name:'120 mm liquid AIO',kind:'aio',height:55,radiator:120},
 {id:'aio240',name:'240 mm liquid AIO',kind:'aio',height:55,radiator:240},
 {id:'aio360',name:'360 mm liquid AIO',kind:'aio',height:55,radiator:360},
 {id:'customLoop',name:'Custom liquid loop + reservoir',kind:'custom',height:55,radiator:240}
];
export const fanModels=[
 {id:'air120',name:'120 mm balanced airflow',size:120,profile:'airflow',cfm:60,maxRpm:1500,watts:2.4},
 {id:'pressure120',name:'120 mm high pressure',size:120,profile:'pressure',cfm:55,maxRpm:1800,watts:3.6},
 {id:'quiet120',name:'120 mm quiet',size:120,profile:'airflow',cfm:45,maxRpm:1200,watts:1.5},
 {id:'air140',name:'140 mm balanced airflow',size:140,profile:'airflow',cfm:78,maxRpm:1500,watts:3.2},
 {id:'pressure140',name:'140 mm radiator fan',size:140,profile:'pressure',cfm:72,maxRpm:1800,watts:4.5}
];
export const boards={atx:{name:'ATX',width:244,height:305},matx:{name:'Micro-ATX',width:244,height:244},itx:{name:'Mini-ITX',width:170,height:170}};
export const byId=(list,id)=>list.find(x=>x.id===id)||list[0];
export function preset(name){const fans=[{mount:0,size:120,rpm:1100,direction:'intake',profile:'airflow'},{mount:1,size:120,rpm:1100,direction:'intake',profile:'airflow'},{mount:2,size:120,rpm:1000,direction:'exhaust',profile:'airflow'},{mount:3,size:120,rpm:900,direction:'exhaust',profile:'airflow'}];const common={buildName:'Balanced gaming PC',case:'mesh',cooler:'tower',coolerProfile:'tower',cpu:88,cpuProfile:'custom',cpuBudget:125,cpuSocket:'custom',boardSocket:'AM5',gpu:'large',gpuProfile:'triple250',gpuHeat:250,gpuLength:300,gpuSlots:3,gpuConnector:'2x8',coolerHeight:155,radiatorSize:240,board:'atx',psu:750,psuForm:'ATX',fanModel:'air120',fans};
 if(name==='quiet')return {...common,buildName:'Quiet everyday PC',cpu:45,cpuBudget:90,gpuHeat:160,gpuProfile:'compact160',gpu:'small',gpuLength:230,gpuSlots:2,gpuConnector:'1x8',psu:550,fans:fans.slice(0,3).map(f=>({...f,rpm:750}))};
 if(name==='creator')return {...common,buildName:'Creator workstation',case:'full',cpu:170,cpuBudget:250,cpuProfile:'9950x',cpuSocket:'AM5',cooler:'aio',coolerProfile:'aio360',radiatorSize:360,coolerHeight:55,gpuHeat:360,gpuProfile:'5080',gpuLength:330,gpuConnector:'16',psu:1000,fans:[...fans,{mount:4,size:120,rpm:1100,direction:'exhaust',profile:'pressure'},{mount:6,size:120,rpm:1100,direction:'exhaust',profile:'pressure'}]};
 if(name==='compact')return {...common,buildName:'Compact living-room PC',case:'itx',board:'itx',cooler:'stock',coolerProfile:'low',coolerHeight:47,cpu:45,cpuBudget:90,gpu:'small',gpuProfile:'compact160',gpuHeat:160,gpuLength:230,gpuSlots:2,gpuConnector:'1x8',psu:650,psuForm:'SFX',fans:fans.slice(0,3)};
 return common;
}
