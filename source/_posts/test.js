let jobList = [1,2,3,4,5,6,7,8,9,10] // 待处理异步任务
const LIMIT = 2 // 并发数限制

function asyncFun(val) {
    return new Promise((resolve, reject) => {
        resolve(val)
        if(jobList.length > 0){
            return asyncFun(jobList.shift())
        }
    })
}

let asyncPool = []
// 初始化第一批任务列表 
for(let i = 0; i < LIMIT; i++){
    let job = jobList.shift()
    asyncPool.push(asyncFun(job))
}

Promise.all(asyncPool).then((res)=>{
    console.log(res)
})