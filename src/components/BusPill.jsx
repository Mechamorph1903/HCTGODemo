import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'


export default function RoutePill({name, color, alt, passthrough}){

    return(
        <div className="rounded-lg  border-2 border-slate-200 grid grid-cols-6 gap-1 items-center h-24 p-5">
            {/*line design or dot */}
            <span className='inline-block rounded-xl h-3 w-3' style={{ backgroundColor: color}}></span>
            <div className='col-span-4'>
                <h4 className='text-[19px]'>{name} Line {alt}</h4>
                <h6 className='text-slate-400 text-xs'>{passthrough.map((point, index) => (
                    <span className="inline-block mr-4" key={index}>{point}</span>
                ))}</h6>
            </div>
            {/* arrow for more info although whole pill is clickable */}
            <FontAwesomeIcon icon="fa-solid fa-arrow-right" className='justify-self-end'/>
           
        </div>
    )
}

