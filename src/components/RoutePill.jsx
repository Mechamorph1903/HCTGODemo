import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { span } from 'framer-motion/client'


export default function RoutePill({name, color, alt, passthrough, routeStatus}){

    return(
        <div className="rounded-lg  border-2 border-slate-200 grid grid-cols-6 gap-1 items-center h-24 p-5">
            {/*line design or dot */}
            <span className='inline-block rounded-xl h-3 w-3' style={{ backgroundColor: color}}></span>
            <div className='col-span-3'>
                <h4 className='text-[19px]'>{name} Line {alt}</h4>
                <h6 className='text-slate-400 text-xs'>{passthrough.map((point, index) => (
                    <span className="inline-block mr-4" key={index}>{point}</span>
                ))}</h6>
            </div>
            <div>
                {
                    routeStatus.status === "Active" && (
                        routeStatus.type === "Delay" ? (
                        <span 
                        title="Delay" 
                        className="inline-flex items-center text-center gap-1.5 px-3 py-1.5 text-sm font-bold font-mono text-amber-400 rounded-xl"
                        >
                            <span className="animate-ping h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 mr-0.5" />
                            ⚠️ Delay
                        </span>                      
                        ) : (
                            <span 
                            title="Detour" 
                            className="inline-flex items-center text-center gap-1.5 px-3 py-1.5 text-sm font-bold font-mono text-red-400 rounded-xl"
                            >
                            <span className="animate-ping h-1.5 w-1.5 rounded-full bg-red-400 shrink-0 mr-0.5" />
                            🚧 Detour
                        </span>
                        )
                    )
                }
            </div>
            {/* arrow for more info although whole pill is clickable */}
            <FontAwesomeIcon icon="fa-solid fa-arrow-right" className='justify-self-end'/>
           
        </div>
    )
}

