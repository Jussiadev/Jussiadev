var objects = [
    {
        id: 1,
        name: 'Apple MacBook Early 2016',
        url: 'https://market.yandex.ru/product/13789322?nid=54544&track=fr_compare',
        photo: 'https://avatars.mds.yandex.net/get-mpic/200316/img_id4767015032380861787/5',
        catalog: 'computers',
        groups: [
            {
                name: 'Type',
                properties: [
                    {
                        name: 'ULTRABOOK',
                        values: ['+']
                    }
                ]
            },
            {
                name: 'Processor',
                properties: [
                    {
                        name: 'ПРОЦЕССОР (ПОДРОБНО)',
                        values: ['Intel Core m3', 'Intel Core m5', 'Intel Core m7 6Y75']
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'Apple MacBook Pro 15 with Retina display Late 2016',
        url: 'https://market.yandex.ru/product/1711753472?nid=54544&track=fr_compare',
        photo: 'https://avatars.mds.yandex.net/get-mpic/195452/img_id3005684587262782533/5',
        catalog: 'computers',
        groups: [
            {
                name: 'Processor',
                properties: [
                    {
                        name: 'ПРОЦЕССОР (ПОДРОБНО)',
                        values: ['Intel Core i5', 'Intel Core i7']
                    }
                ]
            },
            {
                name: 'Who durashka',
                properties: [
                    {
                        name: 'Aleksandr',
                        values: ['Alexandrovich']
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        name: 'Apple iPhone 7 128Gb',
        url: 'https://market.yandex.ru/product/14206682?nid=54726&track=fr_compare',
        photo: 'https://avatars.mds.yandex.net/get-mpic/96484/img_id2934091010768249913/5',
        catalog: 'mobile',
        groups: [
            {
                name: 'Main info',
                properties: [
                    {
                        name: 'ТИП',
                        values: ['смартфон']
                    },
                    {
                        name: 'ВЕС',
                        values: ['1.3 кг']
                    }
                ]
            },
            {
                name: 'Screen',
                properties: [
                    {
                        name: 'MULTITOUCH',
                        values: ['+']
                    }
                ]
            }
        ]
    }
];

var app = new Vue({
    el: '#comparision',
    data: {
        currentCatalog: 'computers',

        groups: [],

        objects: []
    },
    watch: {
        objects: function() {

            /*var objects = [],
                plainData = [];

            // Filter objects by catalog
            for (var i = 0; i < this.objects.length; i++) {
                if (this.objects[i].catalog == this.currentCatalog) {
                    objects.push(this.objects[i]);
                }
            }

            // Make objects values plain
            for (var o = 0; o < objects.length; o++) {
                for (var g = 0; g < objects[o].groups.length; g++) {
                    for (var p = 0; p < objects[o].groups[g].properties.length; p++) {
                        plainData.push({
                            id: objects[o].id,
                            group: objects[o].groups[g].name,
                            property: objects[o].groups[g].properties[p].name,
                            values: objects[o].groups[g].properties[p].values
                        });
                    }
                }
            }

            console.log(plainData);*/


            // Populate all possible groups names
            var groups = [],
                addedGroupNames = [];

            for (var i = 0, max = this.objects.length; i < max; i++) {
                if (this.objects[i].catalog != this.currentCatalog) {
                    continue;
                }
                for (var j = 0; j < this.objects[i].groups.length; j++) {
                    var groupName = this.objects[i].groups[j].name;
                    if (addedGroupNames.indexOf(groupName) === -1) {
                        groups.push({
                            name: this.objects[i].groups[j].name,
                            properties: []
                        });
                        addedGroupNames.push(groupName);
                    }
                }
            }

            // Populate all possible properties names
            for (var i = 0, iMax = groups.length; i < iMax; i++) {
                var groupName = groups[i].name,
                    addedGroupPropertiesNames = [];
                for (var j = 0, jMax = this.objects.length; j < jMax; j++) {
                    if (this.objects[j].catalog != this.currentCatalog) {
                        continue;
                    }
                    for (var k = 0, kMax = this.objects[j].groups.length; k < kMax; k++) {
                        if (groupName != this.objects[j].groups[k].name) {
                            continue;
                        }
                        for (var g = 0, gMax = this.objects[j].groups[k].properties.length; g < gMax; g++) {
                            var propertyName = this.objects[j].groups[k].properties[g].name;
                            if (addedGroupPropertiesNames.indexOf(propertyName) === -1) {
                                groups[i].properties.push({
                                    name: propertyName,
                                    values: []
                                });
                                addedGroupPropertiesNames.push(propertyName);
                            }
                        }
                    }
                }
            }

            // Populate values
            var emptyValue = 'no data';
            for (var i = 0, iMax = groups.length; i < iMax; i++) {
                var groupName = groups[i].name;
                for (var j = 0, jMax = groups[i].properties.length; j < jMax; j++) {
                    var propertyName = groups[i].properties[j].name;
                    next:for (var k = 0, kMax = this.objects.length; k < kMax; k++) {
                        if (this.objects[k].catalog != this.currentCatalog) {
                            continue;
                        }
                        var valueFound = false;
                        for (var g = 0, gMax = this.objects[k].groups.length; g < gMax; g++) {
                            if (this.objects[k].groups[g].name == groupName) {
                                for (var l = 0, lMax = this.objects[k].groups[g].properties.length; l < lMax; l++) {
                                    if (this.objects[k].groups[g].properties[l].name == propertyName) {
                                        valueFound = true;
                                        groups[i].properties[j].values.push(this.objects[k].groups[g].properties[l].values.join(', '));
                                        continue next;
                                    }
                                }
                            }
                        }
                        if (valueFound === false) {
                            groups[i].properties[j].values.push(emptyValue);
                        }
                    }
                }
            }

            this.groups = groups;
        }
    },
    computed: {
        catalog: function() {
            obj = {};
            var catalogs = [];
            for (var i = 0, max = this.objects.length; i < max; i++) {
                catalogs.push(this.objects[i].catalog);
                obj[catalogs] = true;
            }
            console.log(catalogs);
        }
    }
});

app.objects = objects;

