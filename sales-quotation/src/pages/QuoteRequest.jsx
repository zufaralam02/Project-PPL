import React from 'react';
import CalendarPanel from "../components/CalendarPanel";
import { useState } from "react";
const [isModalOpen, setIsModalOpen] = useState(false);

function QuoteRequest() {
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className="px-2 py-2">
    <h1 className="text-slate-800 font-bold text-xl">
      Add New Quote Request
    </h1>
    </div>
    <div className="lg:flex lg:border lg:border-slate-300 lg:ml-4 lg:mr-4 lg:mb-4">
      <div className="flex flex-col lg:w-1/2 lg:min-h-screen bg-slate-50 border-r border-slate-300">
        <div className="m-5">
        <form action="" className=' border-slate-500'>
          <div className="md:max-w-2xl">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-4 items-center'>
              
              {/* Requested By */}
              <label className='text-md font-medium'>Requested By:</label>
              <div className='flex w-full md:w-64 border-2 border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500'>
                <input type="text" className="w-full outline-none px-2 py-1" readOnly/>
                <button type="button" className="p-2 bg-slate-100 border-l border-slate-300 hover:bg-slate-200 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
              </div>

              {/* Representative */}
              <label className='text-md font-medium'>Representative:</label>
              <input type="text" className="w-full md:w-64 border-2 border-slate-300 rounded-md focus:border-blue-500 outline-none px-2 py-1" />

              {/* Aircraft */}
              <label className='text-md font-medium'>Aircraft:</label>
              <div className='flex w-full md:w-64 border-2 border-slate-300 rounded-md overflow-hidden focus-within:border-blue-500'>
                <input type="text" className="w-full outline-none px-2 py-1" />
                <button type="button" className="px-2 bg-slate-100 border-l border-slate-300 hover:bg-slate-200 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
              </div>

              {/* Trip Type */}
              <label className='text-md font-medium'>Trip Type:</label>
              <div className='relative w-full md:w-64 group'>
                <input type="text" className="w-full border-2 border-slate-300 rounded-md focus:border-blue-500 outline-none px-2 py-1 pr-10" readOnly />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                </div>
              </div>
            </div>

            {/* Submit Button Section */}
            <div className='mt-8 mb-5 flex justify-end'>
              <button className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 font-bold rounded shadow-md transition-transform active:scale-95">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className='md:max-w-2xl'>
        <div className='grid grid-cols-3 md:grid-cols-6 gap-2 border-b pb-1 mb-2 justify-items-center border-slate-300'>
          <label className='text-center'>ADEP</label>
          <label className='text-center'>ADES</label>
          <div></div>
          <label className='text-center'>DATE LT</label>
          <label className='text-center'>TIME LT</label>
          <label className='text-center'>PAX</label>
        </div>


        <div className='grid grid-cols-3 md:grid-cols-6 gap-2 border-b pb-2 mb-2 justify-items-center border-slate-300'>
          <input className='w-18 border-2 border-slate-300 rounded-md px-2 py-1' />
          <input className='w-18 border-2 border-slate-300 rounded-md px-2 py-1' />
          <input className='w-18 border-2 border-slate-300 rounded-md px-2 py-1' />
          <input className='w-18 border-2 border-slate-300 rounded-md px-2 py-1' />
          <input className='w-18 border-2 border-slate-300 rounded-md px-2 py-1' />
          <input className='w-18 border-2 border-slate-300 rounded-md px-2 py-1' />
        </div>
      </div>
      </div>
      <div className="lg:w-1/2 bg-slate-50 border-slate-300">
        <h1 className="text-white bg-blue-500 font-bold text-xl p-2">Calendar</h1>
        <CalendarPanel />
      </div>
    </div>
    </div>
  );
}

export default QuoteRequest;