
/**
 * want to add date sections: today, yesterday, and so forth
 * may clear notis that are maybe 7 days from current date
 */


export default function AlertPill({subject, message, priority, buses}){
 
    const priorityColor = {
        low: 'border-green-600',
        medium: 'border-yellow-500',
        high: 'border-red-700'
    }

    return(
        <div className={`p-2 text-sm border-l-3 rounded-sm ${priorityColor[priority]} bg-slate-100`}>
            <div className="flex items-center justify-between ">
                <h1 className="text-md font-bold">{subject}</h1>
                {/* //there will be a map here to put all the color dots of every bus with notis */}
               <div className="flex gap-2">
                    {
                        buses.map((bus, index) => (
                            <div className='rounded-lg h-2 w-2' style={{ backgroundColor: bus}}></div>
                        ))
                    }
               </div>
            </div>
            <p>{message}</p>
        </div>
    )

}