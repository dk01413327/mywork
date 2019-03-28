<template>
    <div> 
        <div class="report">
            <el-date-picker
                v-model="monthno"
                value-format="yyyyMM"
                type="month"
                placeholder="选择月份">
            </el-date-picker>
            <el-button type="primary" @click="download">报表下载</el-button>
        </div>       

        <div id="div-location" v-if="locations.length>0">
            
            <el-table size="mini" broder :data="locations"  @row-click="showMapLoaction" >
                <el-table-column label="位置" prop="loc_code"></el-table-column>
                <el-table-column label="状态" min-width="100px" >
                    <template slot-scope="scope">
                    <span v-if="scope.row.overdue>0" class="status bg-danger">已过期 {{scope.row.overdue}}天</span>
                    <span v-else-if="scope.row.store_goods" class="status">已存放</span>
                    <span v-else class="status bg-white" style="color:#000">未存放</span>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div id="showMessage" class="card border-warning" style="width: 20rem;">
            <div class="card-header bg-warning">
                存放信息
            </div>
            <div class="card-body">
                <table  class="table table-sm bordered" style="font-size:12px">
                    <tr><td>存放物品</td><td>{{showData.store_goods}}</td></tr>
                    <tr><td>物品状态</td><td>{{showData.goods_status}}</td></tr>
                    <tr><td>物品写真</td><td class="clickable" @click="visibleChange(true)">点击查看</td></tr>
                    <tr><td>存放期限</td><td>{{showData.start_time}}~{{showData.end_time}}</td></tr>
                    <tr><td>存放原因</td><td>{{showData.store_reason}}</td></tr>
                    <tr><td>负责人</td><td>{{showData.duty_by}}</td></tr>
                    <tr><td>申请部门</td><td>{{showData.dept}}</td></tr>
                </table>
            </div>
            <div class="card-footer">
                <el-button size="small" type="danger" @click="closeRequest(showData.apply_no)" v-if="permission.substr(4,1)==1">结案</el-button>
                <el-button size="small" type="warning" @click="turnMessage(false)">关闭窗口</el-button>
            </div>
        </div>
        <imageShower id="preview" title="物品写真" :file-list='fileList' :dialog-visible="dialogVisible" @visibleChange='visibleChange'></imageShower>
        <div id="map"></div>
    </div>
</template>
<script>
//import * as THREE from 'three'
import {CSS2DRenderer,CSS2DObject} from 'three-css2drender'
import {get_curr_date} from '../../../static/js/public.js'
import {mapGetters, mpaActions} from 'vuex'
export default {
    data(){
        return{
            permission:'',
            dialogVisible:false,
            monthno:'',
            fileList:[],
            sceneType:0,
            planes:[],
            locations:[],
            showData:{},
            scene:'',
            scene1:'',
            scene4:'',
            camera:'',
            light:'',
            renderer:'',
            labelRenderer:'',
            controls:'',
            clock:'',
            delta:'',
            locColor:['#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff'],
            buildingColor:['#afc0ca','#afc0ca','#e3f2fd','#d6e4ec','#afc0ca','#afc0ca'],
            dormColor:['#c39483','#c39483','#d5d2d2','#d5d2d2','#c39483','#c39483'],
            goodsColor:['#8bc34a','#8bc34a','#8bc34a','#8bc34a','#8bc34a','#8bc34a'],
            overdueColor:['#ff5722','#ff5722','#ff5722','#ff5722','#ff5722','#ff5722'],
            buildingMaterial:[],dormMaterial:[],goodsMaterial:[],overdueMaterial:[],
        }
    },
    computed:{
        ...mapGetters(['getPermission','userinfo','imageUrl','downloadUrl'])
    },
    watch:{
        locations(data){
            this.init();
        }
    },
    created(){
        this.permission=window.sessionStorage.getItem('permission');
        if(!this.permission){
            this.permission='0000000';
        }
        this.getData();
        window.onresize = this.onWindowResize;
    },
    methods:{
        getData(){
            this.$store.dispatch('getLocations',{data:'',cb:res=>{
                this.planes = res.data[0];
                this.locations = res.data[1];
            }});
        },
        showMapLoaction(row, event, column){
            this.sceneType=row.scene;
            this.init();
            if(row.camera_x){
                this.camera.position.x = row.camera_x;
                this.camera.position.y = row.camera_y;
                this.camera.position.z = row.camera_z;
            }else{
                this.camera.position.x = 2000;
                this.camera.position.y = 1800;
                this.camera.position.z = 3;
            }
            
        },
        initColor(){
            this.locMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
            this.door = new THREE.MeshPhongMaterial({color: 0xffffff,transparent:true,opacity:0.9});
            for(var i=0;i<this.buildingColor.length;i++){
                this.buildingMaterial[i] = new THREE.MeshPhongMaterial({color: this.buildingColor[i]}); 
            }
            for(var i=0;i<this.dormColor.length;i++){
                this.dormMaterial[i] = new THREE.MeshPhongMaterial({color: this.dormColor[i]}); 
            }
            for(var i=0;i<this.goodsColor.length;i++){
                this.goodsMaterial[i] = new THREE.MeshPhongMaterial({color: this.goodsColor[i]}); 
            }
            for(var i=0;i<this.overdueColor.length;i++){
                this.overdueMaterial[i] = new THREE.MeshPhongMaterial({color: this.overdueColor[i]}); 
            }
        },
        initCamera(){
            //创建一个摄像机对象（摄像机决定了能够在场景里看到什么）
            this.camera = new THREE.PerspectiveCamera(45,
            window.innerWidth / window.innerHeight, 1, 10000000);
            
            //设置摄像机的位置，并让其指向场景的中心（0,0,0）
            this.camera.position.x = 2000;
            this.camera.position.y = 1800;
            this.camera.position.z = 3;
            this.camera.lookAt(0,0,0);
        },
        initLight(){
            // light
            this.light = new THREE.AmbientLight(0xffffff, 1, 200);
            this.light.position.set(10, 15, 25);
            this.scene.add(this.light);

            this.light = new THREE.AmbientLight(0xffffff, 1, 200);
            this.light.position.set(10, 15, 25);
            this.scene4.add(this.light);

            this.light = new THREE.AmbientLight(0xffffff,1,200);
            this.light.position.set(10, 15, 25);
            this.scene1.add(this.light);

        },
        initRender(){
            //创建一个WebGL渲染器并设置其大小            
            var width = window.innerWidth;
            var height = window.innerHeight;       
            
            this.renderer = new THREE.WebGLRenderer({antialias:true,autoClear:true});
            this.renderer.setClearColor(new THREE.Color(0xEEEEEE));
            this.renderer.setSize(width, height);
            document.getElementById('map').appendChild(this.renderer.domElement);

            this.labelRenderer = new CSS2DRenderer();
            this.labelRenderer.setSize( width, height );
            this.labelRenderer.domElement.style.position = 'absolute';
            this.labelRenderer.domElement.style.top = 0;
            this.labelRenderer.domElement.className = 'factory';
            document.body.appendChild( this.labelRenderer.domElement );

            var _this = this;
            var OrbitControls = require('three-orbit-controls')(THREE)
            this.controls = new OrbitControls( this.camera,this.labelRenderer.domElement );
            this.controls.addEventListener('start',function(){
                //$('.label').css('display','none')
            })
            this.controls.addEventListener('end',function(){
                //$('.label').css('display','block')
                _this.displayLabel();
            })
            this.clock = new THREE.Clock();
        },
        //外围
        addBuilding(scene){
            this.createPlane(scene,2000,2000,0x333333,-0.5,0,-1,0);
            //1栋
            this.createCube(scene,900, 200, 600, 1, this.buildingColor,-250,100,600,'1栋');
            //this.createCubeTexture(scene,900, 1000, 600, 1, '/static/images/wall.png',-250,500,600,'1栋')
            //2栋
            this.createCube(scene,500, 200, 500, 0, this.buildingColor,-350,100,-550,'2栋');
            //3栋
            this.createCube(scene,300, 200, 300, 0, this.buildingColor,550,100,650,'3栋');
            //4栋
            this.createCube(scene,300, 200, 200, 0, this.buildingColor,700,100,-700,'4栋');

            //1栋延长
            this.createCube(scene,300, 200, 500, 0, this.buildingColor,-550,100,50,'');
            //1栋后仓库
            this.createCube(scene,100, 50, 1900, 0, this.dormColor,-950,25,-50,'电工房');

            //1#宿舍
            this.createCube(scene,400, 100, 900, 0, this.dormColor,200,50,-350,'1#宿舍');        
            //3#宿舍
            this.createCube(scene,400, 100, 100, 0, this.dormColor,600,50,350,'3#宿舍');
            //4#宿舍
            this.createCube(scene,200, 100, 100, 0, this.dormColor,600,50,50,'4#宿舍');
        },
        addLocation(scene){
            for(var i=0;i<this.planes.length;i++){
                var item = this.planes[i];
                if(this.sceneType == item.scene){
                    this.createPlane(scene,item.width,item.long,0xffc107,item.angle,item.pos_x,item.pos_y,item.pos_z);
                }
                
            }
            var _this = this;
            for(var i = 0; i<this.locations.length; i++){
                var item = this.locations[i];
                if(this.sceneType == item.scene){
                    if(item.apply_no){
                        if(item.overdue>0){
                            this.createCube(scene,item.width,50,item.deep,-0.5,this.overdueColor,item.pos_x,item.pos_y+25,item.pos_z,item,'location'+item.id);
                        }else{
                            this.createCube(scene,item.width,50,item.deep,-0.5,this.goodsColor,item.pos_x,item.pos_y+25,item.pos_z,item,'location'+item.id);
                        }                    
                    }else{
                        this.createCube(scene,item.width,item.height,item.deep,-0.5,this.locColor,item.pos_x,item.pos_y,item.pos_z,item.loc_code,'location'+item.id);                    
                    }
                }
                
            } 
        },
        addOutWall(scene){
            //1栋围墙
            this.createCube(scene,500, 50, 10, 1, this.dormColor,670,25,995,'');
             //1栋保安
            this.createCube(scene,80, 80, 80, 0, this.dormColor,390,40,960,'');
             //1栋围墙
            this.createCube(scene,900, 50, 10, 1, this.dormColor,-250,25,995,'');
            this.createCube(scene,100, 100, 100, 0, this.dormColor,-950,50,950,'');
            //var cube2 = this.returnCube(200, 1, 5, 1, this.dormColor,300,0,1000,'');
            //this.createResultBSP(cube1,cube2,new THREE.MeshBasicMaterial({color:0xb9d0e2}));
            //this.createResultBSP(scene,cube1,cube2,this.dormColor);

            //3栋保安
            this.createCube(scene,80, 80, 80, 0, this.dormColor,960,40,960,'');
            
            this.createCube(scene,1900, 50, 10, 1, this.dormColor,50,25,-995,'');

            this.createCube(scene,10, 50, 600, 0, this.dormColor,995,25,-700,'');

            this.createCube(scene,10, 50, 500, 0, this.dormColor,995,25,550,'');

            //this.createCube(200,50,500,0, this.dormColor,900,25,50,'')
            this.createPlane(scene,200,500,0xffc107,-0.5,900,0,50)
            //4#保安室
            this.createCube(scene,100, 80, 100, 0, this.dormColor,950,40,-250,'');
        },
        //1栋内部
        init1D(scene){
            this.createPlaneTexture(scene,2000,2000,'/static/images/floor.png',-0.5,0,0,0);
            //墙左，后，右
            this.createCube(scene,2000, 500, 10, 1, this.dormColor,5,250,995,'');
            this.createCube(scene,10, 500, 2000, 0, this.dormColor,-1000,250,0,'');
            this.createCube(scene,2000, 500, 10, 1, this.dormColor,5,250,-995,'');
            //this.createCube(scene,2000,10,2000,1,this.dormColor,0,300,0,'')
            this.createCube(scene,800,50,400,1,this.dormColor,-590,325,790,'');
            this.createCube(scene,100,1,200,1,this.dormColor,-235,360,850,'电梯');

            this.createCube(scene,600,50,200,1,this.dormColor,-690,325,300,'天桥');
            this.createCube(scene,100,1,300,1,this.dormColor,-235,360,-300,'医务室');

            this.createCube(scene,200,50,1600,1,this.dormColor,-290,325,-200,'');

            this.createCube(scene,1000,50,2000,1,this.dormColor,500,325,0,'');
            this.createCube(scene,20,20,20,1,this.locColor,-1000,500,995,'1栋内');
            this.createPlane(scene,200,2000,0x008000,-0.5,-100,300,0); 
            
            //this.createCube(scene,1000,200,300, 0, this.dormColor,500,400,-840,'FCT治具房');
           
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(-100,300,-1000));
            geometry.vertices.push(new THREE.Vector3(-100,300,1000));            
            var material = new THREE.LineDashedMaterial({color:0xffc107,dashSize:3,gapSize:2,lineWidth:10,scale:0.1 });
            var line = new THREE.Line(geometry,material);
            line.computeLineDistances();  //注意加上这句
            scene.add(line);
            
        },
        //4栋内部
        init4D(scene){
            this.createPlaneTexture(scene,2000,2000,'/static/images/floor.png',-0.5,0,0,0);
            //墙左，后，右
            this.createCube(scene,2000, 400, 10, 1, this.dormColor,5,200,995,'');
            this.createCube(scene,10, 400, 2000, 0, this.dormColor,-1000,200,0,'');
            this.createCube(scene,2000, 400, 10, 1, this.dormColor,5,200,-995,'');
            this.createCube(scene,20,20,20,1,this.locColor,-1000,400,995,'4栋内')
            //楼层地板
            this.createCube(scene,1000, 10, 2000, 0, this.dormColor,-500,200,0,'');
            
            //
        },
        init(id) {
            this.initColor();
            //创建一个场景（场景是一个容器，用于保存、跟踪所要渲染的物体和使用的光源）
            $('#map').html('')
            $('.factory').remove();
            this.scene = new THREE.Scene();
            this.scene1= new THREE.Scene();
            this.scene4 = new THREE.Scene();
            //this.scene.background = new THREE.CubeTextureLoader()
            //                        .setPath('/static/images/skybox/')
            //                        .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ]);
            //添加网格
            //var gridHelper1 = new THREE.GridHelper(2000,20);
            this.initCamera();
            this.initLight();
            this.initRender();
            if(this.sceneType==0){
                this.addBuilding(this.scene);
                this.addLocation(this.scene);
                this.addOutWall(this.scene);
                //this.scene.add(gridHelper);
            }else if (this.sceneType == 1){
                this.init1D(this.scene1);
                this.addLocation(this.scene1);
            }else{
                this.init4D(this.scene4);
                this.addLocation(this.scene4)
            }
            //在场景中添加坐标轴
            var axes = new THREE.AxesHelper(200);
            this.scene.add(axes);           
            window.addEventListener( 'click', this.onMouseDown, false );
            this.render();
        },
        createPlane(scene,width,long,color,angle,x,y,z){
            var planeGeometry = new THREE.PlaneGeometry(width, long);
            var planeMaterial = new THREE.MeshBasicMaterial({color: color});
            var plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = angle * Math.PI;
            plane.position.x = x;
            plane.position.y = y;
            plane.position.z = z;
            scene.add(plane);
        },
        createPlaneTexture(scene,width,long,images,angle,x,y,z){
            var texture = this.createTexture(width/100, long/100,images);
            var planeGeometry = new THREE.PlaneGeometry(width, long);
            var planeMaterial = new THREE.MeshBasicMaterial({map: texture});
            var plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = angle * Math.PI;
            plane.position.x = x;
            plane.position.y = y;
            plane.position.z = z;
            scene.add(plane);
        },
        createTexture(repeatX, repeatY,images){
            var loader = new THREE.TextureLoader()
            var texture = loader.load(images,function(t){});
            texture.wrapS = THREE.RepeatWrapping 
            texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(repeatX,repeatY);
            return texture;
        },
        createGeometry(scene,params){
            if(params.type=='cube'){
                    var cubeGeometry = new THREE.BoxGeometry(params.size.width, params.size.height, params.size.depth);
                var cube = new THREE.Mesh(cubeGeometry, params.material);
                cube.position.x = params.position.x;
                cube.position.y = params.position.y;
                cube.position.z = params.position.z;            
                cube.rotation.y += params.position.angle * Math.PI; //-逆时针旋转,+顺时针
                if(params.border){
                    var cubeEdges = new THREE.EdgesGeometry( cubeGeometry,1 );
                    let edgesMtl =  new THREE.LineBasicMaterial({color: params.border.color});
                    let cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);
                    cube.add(cubeLine);
                }
                scene.add(cube);
            }else if(params.type=='plane'){
                var planeGeometry = new THREE.PlaneGeometry(params.size.width, params.size.depth);                
                var plane = new THREE.Mesh(planeGeometry, params.material);
                plane.rotation.x = params.position.angle * Math.PI;
                plane.position.x = params.position.x;
                plane.position.y = params.position.y;
                plane.position.z = params.position.z;
                scene.add(plane);
            }
            
        },
        createCube(scene,width, height, depth, angle, colors, x, y, z,caption,name){
            var text = '';
            if(typeof caption == 'object'){
                text = caption.loc_code;
            }else{
                text = caption;
            }
            var mat = [];
            for(var i=0; i<colors.length; i++){
                if(i==2){
                    mat[i] =  new THREE.MeshPhongMaterial({color: colors[i]}); 
                }else{
                    mat[i] =  new THREE.MeshPhongMaterial({color: colors[i],transparent:true,opacity:0.9}); 
                }                 
            }
            var cubeGeometry = new THREE.BoxGeometry(width, height, depth);
            var cube = new THREE.Mesh(cubeGeometry, mat);
            cube.position.x = x;
            cube.position.y = y;
            cube.position.z = z;
            
            cube.rotation.y += angle * Math.PI; //-逆时针旋转,+顺时针
            if(typeof caption == 'object'){
                cube.userData = caption;
            }
            if(text){
                if(name){
                    this.add2DText(cube,text,x,height,'location-label');                    
                }else{
                    this.add2DText(cube,text,x,height,'building-lalel');
                }                
            }            
            if(height>50){
                var cubeEdges = new THREE.EdgesGeometry( cubeGeometry,1 ); 
                let edgesMtl =  new THREE.LineBasicMaterial({color: 0xeeeeee});
                let cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);
                cube.add(cubeLine);
            }
            if(name){
                cube.name=name;
            }
            scene.add(cube);     
            /*
            var material = new THREE.LineBasicMaterial({color:0x333333});
            var geometry = new THREE.Geometry();
            var points = cubeGeometry.vertices;   
            geometry.vertices.push(new THREE.Vector3(points[0].x,points[0].y,points[0].z));
            geometry.vertices.push(new THREE.Vector3(points[1].x,points[1].y,points[1].z));
            geometry.vertices.push(new THREE.Vector3(points[4].x,points[4].y,points[4].z));
            geometry.vertices.push(new THREE.Vector3(points[5].x,points[5].y,points[5].z));
            geometry.vertices.push(new THREE.Vector3(points[0].x,points[0].y,points[0].z));
            var line = new THREE.Line(geometry,material);
            line.position.set(x,y,z);
            this.scene.add(line); */                    
        },
        createCubeTexture(scene,width, height, depth, angle, images, x, y, z,caption,name){
            var texture = this.createTexture(width/20, height/20,images);
            var material = new THREE.MeshBasicMaterial({map:texture});
            var cubeGeometry = new THREE.BoxGeometry(width, height, depth);            
            var cube = new THREE.Mesh(cubeGeometry, material);
            cube.position.x = x;
            cube.position.y = y;
            cube.position.z = z;
            
            cube.rotation.y += angle * Math.PI; //-逆时针旋转,+顺时针

            scene.add(cube);
        },
        getGeometry(points,height){
            var topPoints = [];
            for(var i=0;i<points.length;i++){
                var vertice = points[i];
                topPoints.push([vertice[0],vertice[1]+height,vertice[2]]);
            }
            var totalPoints = points.concat(topPoints);
            var vertices =[];           //所有的顶点
            for(var i=0;i<totalPoints.length;i++){
                vertices.push(new THREE.Vector3(totalPoints[i][0],totalPoints[i][1],totalPoints[i][2]))
            }
            var length = points.length;
            var faces = [];
            for(var j=0;j<length;j++){//侧面生成三角形
                if(j!=length-1){
                    faces.push(new THREE.Face3(j,j+1,length+j+1));
                    faces.push(new THREE.Face3(length+j+1,length+j,j));
                }else{
                    faces.push(new THREE.Face3(j,0,length));
                    faces.push(new THREE.Face3(length,length+j,j));
                }
            }
            var data=[];
            for(var i=0;i<length;i++){
                data.push(points[i][0],points[i][2]);
            }
            var triangles = Earcut.triangulate(data);
            if(triangles && triangles.length != 0){
                for(var i=0;i<triangles.length;i++){
                    var tlength = triangles.length;
                    if(i%3==0 && i < tlength-2){
                        faces.push(new THREE.Face3(triangles[i],triangles[i+1],triangles[i+2]));                            //底部的三角面
                        faces.push(new THREE.Face3(triangles[i]+length,triangles[i+1]+length,triangles[i+2]+length));        //顶部的三角面
                    }
                }
            }
            var geometry = new THREE.Geometry();
            geometry.vertices = vertices;
            geometry.faces = faces;
            geometry.computeFaceNormals();      //自动计算法向量
            return geometry;
		},
        markSprite(scene,text,x,y,z,url){
            //sprite
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            var ratio =this.getPixelRatio(ctx);
            canvas.style.width = canvas.width / ratio;
            canvas.style.height = canvas.height / ratio;
            ctx.fillStyle = "#ffff00";
            ctx.font = "Bold 80px Arial";
            //ctx.lineWidth = 1;
            ctx.fillText(text,4,104);
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;

            //使用Sprite显示文字
            let material = new THREE.SpriteMaterial({map:texture});
            let textObj = new THREE.Sprite(material);
            textObj.position.set(x,y+100,z);
            textObj.scale.set(100, 100, 1);
            scene.add(textObj)
            return false;
        },
        add2DText(geometry,text,x,y,className){
            var Div = document.createElement( 'div' );
            Div.className = className+' label';
            Div.textContent = text;
            Div.style.marginTop = '-1em';
            var label = new CSS2DObject( Div );
            label.position.set( 0, 1, 0 );
            geometry.add( label );
        },
        getCanvasText(text,color){
            var width=512, height=256; 
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            var ratio =this.getPixelRatio(ctx);
            canvas.style.width = canvas.width / ratio;
            canvas.style.height = canvas.height / ratio;
            ctx.fillStyle = color ? color : '#ffc107';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = 100+'px " bold';
            //ctx.fillStyle = 'blue';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.scale(1,1);
            ctx.fillText(text,canvas.width/2,canvas.height/2);        
            return canvas;
        },
        getPixelRatio(context) {
            var backingStore = context.backingStorePixelRatio 
            || context.webkitBackingStorePixelRatio 
            || context.mozBackingStorePixelRatio 
            || context.msBackingStorePixelRatio 
            || context.oBackingStorePixelRatio 
            || context.backingStorePixelRatio || 1;
            return (window.devicePixelRatio || 1) / backingStore;
        },
        getPoiScale(position,poiRect,height){
            if(!position) return;
            var distance = this.camera.position.distanceTo(position);
            var top = Math.tan(this.camera.fov / 2 * Math.PI / 180)*distance;    //camera.fov 相机的拍摄角度
            var meterPerPixel = 2*top/height;
            var scaleX = poiRect.w * meterPerPixel;
            var scaleY = poiRect.h * meterPerPixel;
            return [scaleX,scaleY,1.0];
        },
        returnCube(width, height, depth, angle, material, x, y, z,caption){
            var cubeGeometry = new THREE.BoxGeometry(width, height, depth);            
            var cube = new THREE.Mesh(cubeGeometry);
            cube.position.x = x;
            cube.position.y = y;
            cube.position.z = z;
            
            cube.rotation.y += angle * Math.PI; //-逆时针旋转,+顺时针
            return cube;
        },
        createResultBSP(scene,bsp,lessBsp,colors){
            var mat = [];
            for(var i=0; i<colors.length; i++){
                mat[i] =  new THREE.MeshPhongMaterial({color: colors[i],transparent:true,opacity:0.9});  
            }
            var sphereBSP = new ThreeBSP(bsp);
            var cubeBSP = new ThreeBSP(lessBsp);
            var resultBSP = sphereBSP.subtract(cubeBSP);
            var result = resultBSP.toMesh();
            if(mat){
                result.material = mat;
                result.material.flatshading = THREE.FlatShading;
            }            
            result.geometry.computeFaceNormals();
            result.geometry.computeVertexNormals();
            result.material.needsUpdate = true;
            result.geometry.buffersNeedUpdate = true;
            result .geometry.uvsNeedUpdate = true;
            scene.add(result);
        },
        generateSprite(text,style) {
            var canvas = document.createElement( 'canvas' );
            canvas.width = 128;
            canvas.height = 128;

            var context = canvas.getContext( '2d' );
                context.beginPath();
                context.font='20px Microsoft YaHei';
                context.fillStyle = "#ffff00";
                context.fillText(text,0,50);
                context.fill();
                context.stroke();
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;

            let material = new THREE.SpriteMaterial({map:texture,transparent:true});
            let textObj = new THREE.Sprite(material);
            textObj.scale.set(100,100,100);
            textObj.position.set( 900, 200, 600 )
            return textObj;

        },
        onMouseDown(e){
            e.preventDefault();
            //var cube = this.scene.getChildByName('location1');
            var mouse = new THREE.Vector2();
            var raycaster = new THREE.Raycaster();
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera( mouse, this.camera );
            if(this.sceneType==0){
                var intersects = raycaster.intersectObjects(this.scene.children );
            }else if(this.sceneType == 1){
                var intersects = raycaster.intersectObjects(this.scene1.children );
            }else{
                var intersects = raycaster.intersectObjects(this.scene4.children );
            }
            
            if(intersects.length>0){                
                var data  = intersects[0].object.userData;
                if(!data.apply_no) return false;
                this.showData = data;
                this.turnMessage(false);
                this.fileList = [];
                if(this.showData.pic1){
                    this.fileList.push(this.imageUrl+this.showData.pic1)
                }
                if(this.showData.pic2){
                    this.fileList.push(this.imageUrl+this.showData.pic2)
                }
                this.turnMessage(true);
            }
            console.log(this.camera);
        },
        //three世界坐标转为屏幕坐标
        threeToScreen(obj){
            var vector = new THREE.Vector3(
                obj.position.x,obj.position.y,obj.position.z
            );
            var widthHalf = 0.5 * window.innerWidth;
            var heightHalf = 0.5 * window.innerHeight;
            var standard = vector.project(this.camera);
            console.log(standard);
            var x = Math.round(standard.x * widthHalf + widthHalf)+'px';
            var y = Math.round(-standard.y * heightHalf + heightHalf-130)+'px';
            console.log(x,y);
            var div = document.createElement('div');
            div.innerHTML = '立方体';
            div.style.padding = '5px';
            div.style.position = 'absolute';
            div.style.backgroundColor = 'rgba(155,0,155,0.8)';
            div.style.left = x;
            div.style.top = y;
            //document.body.appendChild(div);
            return {
                x: x,
                y: y
            };
        },
        render(){
            //渲染场景
            this.delta = this.clock.getDelta();
            this.controls.update(this.delta);
            requestAnimationFrame(this.render);
            if(this.sceneType==0){
                this.renderer.render(this.scene, this.camera);
                this.labelRenderer.render( this.scene, this.camera );  
            }else if(this.sceneType==1){
                this.renderer.render(this.scene1, this.camera);
                this.labelRenderer.render( this.scene1, this.camera );  
            }else{
                this.renderer.render(this.scene4, this.camera);
                this.labelRenderer.render( this.scene4, this.camera );  
            }       
        },
        displayLabel(){
            var _this = this;
            var arr = []
            $('.label').each(function(idx,item){
                //console.log(item.style.cssText);
                var visible = $('.label:eq('+idx+')').css('display')!='none'
                if(visible){
                    arr.push(_this.parseStr(item.style.cssText));
                }else{
                    arr.push([0,0])
                }
                //console.log(item.offset().left);
            })
            $('.label').css('display','block');
            $.each(arr,function(idx,item){
                for(var i=0; i<arr.length;i++){
                    if( idx == i){
                        continue;
                    }
                    var visible = $('.label:eq('+idx+')').css('display')!='none'
                    if(Math.abs(parseFloat(item[1])-parseFloat(arr[i][1]))<5
                        &&Math.abs(parseFloat(item[0])-parseFloat(arr[i][0]))<5
                        && visible){
                        //console.log(idx,parseFloat(item[1]),parseFloat(arr[i][1]));
                        $('.label:eq('+i+')').css('display','none');
                    }else if( !visible ){
                        //console.log(idx,parseFloat(item[1]),parseFloat(arr[i][1]));
                        $('.label:eq('+i+')').css('display','block');
                    }
                }
            })
        },
        isPOIRect(sprite1,sprite2){
            var x1 = sprite1.x,y1=sprite1.y,w1=sprite1.w,h1=sprite1.h;
            var x2 = sprite2.x,y2=sprite2.y,w1=sprite2.w,h1=sprite2.h;
            if (x1 >= x2 && x1 >= x2 + w2) {
                return false;
            } else if (x1 <= x2 && x1 + w1 <= x2) {
                return false;
            } else if (y1 >= y2 && y1 >= y2 + h2) {
                return false;
            } else if (y1 <= y2 && y1 + h1 <= y2) {
                return false;
            }else{
                return true;
            }
        },
        parseStr(str){
            str = str.substring(str.lastIndexOf('translate')+10)
            str = str.substring(1,str.length-2);
            var arr = str.split(',');
            return arr;
        },
        visibleChange(data){
            this.dialogVisible = data;
        },
        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();  
            this.render();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.labelRenderer.setSize( window.innerWidth, window.innerHeight );
       
        },
        download(){
            if(this.monthno==''){
                this.$alert('请选择月份','出错啦',{type:'error'});
                return false;
            }
            window.open(this.downloadUrl+'/index/others/download_wf_report?monthno='+this.monthno);
        },
        closeRequest(applyno){
            var _this = this;
            this.$confirm('确定结案此单?','提示',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(({value})=>{
                var post = 'applyno='+applyno
                          +'&opuser='+_this.userinfo.emp_no;
                this.$store.dispatch('closeWfRequest',{data:post,cb:(res)=>{
                    if(res.errcode==0){
                        this.$message({message:res.errmsg,type:'success'});
                        _this.clsoeMessage();
                        _this.getData(); 
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'});
                    }
                }})
            })
        },
        turnMessage(flag){
            if(flag){
                $('#showMessage').css('display','block');
            }else{
                $('#showMessage').css('display','none');
            }
        }
    }
}
</script>
<style>
    body{
        overflow: hidden;
    }
    .report{
        position: fixed;
        z-index: 10;
        left:45%;
        background: #000;
        border-radius: 5px;
        padding:5px;
    }
    #indicator{
        position: fixed;
        top:5px;
        right :5px;
        padding: 0;
        list-style: none;
        border: 1px solid #000000;
    }
    #indicator li{
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color:#fff;
    }

    #div-location{
        position: fixed;
        z-index: 10;
        left: 10px;
        top:10px;
        padding:5px;
        background-color:#000;
        border-radius: 5px;
    }
    #showMessage{
        position: fixed;
        z-index: 10;
        top:10px;left:215px;
        display: none;
    }
    .label{
        font-size: 12px;
        font-weight: 600;
    }
    .location-label{        
        color:#5a5858;
    }
    .building-lalel{
        font-size: 14px;
        color:blue;
    }
    .status{
        background-color: green;
        padding: 8px;
        color:#fff;
    }
    .used{
        background: red;
    }
</style>
