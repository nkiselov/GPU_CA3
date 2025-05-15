class PyramidalNet{

    constructor(gl,w,h){
        this.voltPong = new PingPong(
            new ComputeTexture(gl,TextureType.T4F,w,h,null,true),
            new ComputeTexture(gl,TextureType.T4F,w,h,null,true)
        )
        this.somaPong1 = new PingPong(
            new ComputeTexture(gl,TextureType.T4F,w,h,null,true),
            new ComputeTexture(gl,TextureType.T4F,w,h,null,true)
        )
        this.somaPong2 = new PingPong(
            new ComputeTexture(gl,TextureType.T3F,w,h,null,true),
            new ComputeTexture(gl,TextureType.T3F,w,h,null,true)
        )
        this.proxPong1 = new PingPong(
            new ComputeTexture(gl,TextureType.T4F,w,h,null,true),
            new ComputeTexture(gl,TextureType.T4F,w,h,null,true)
        )
        this.proxPong2 = new PingPong(
            new ComputeTexture(gl,TextureType.T3F,w,h,null,true),
            new ComputeTexture(gl,TextureType.T3F,w,h,null,true)
        )
        this.distPong1 = new PingPong(
            new ComputeTexture(gl,TextureType.T2F,w,h,null,true),
            new ComputeTexture(gl,TextureType.T2F,w,h,null,true)
        )
    }


}