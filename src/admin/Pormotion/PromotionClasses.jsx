import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';

export const PromotionClasses = () => {

    const [classArray, setClassarray] = useState([]);
    const [promotionSessionyear, setPromotionsessionYear] = useState(null);
    const [Classname, setClassName] = useState(null);
    const [ClassId, setClassId] = useState(null);
    const [studentResult , setStudentresults] = useState([]);
    const [check , setCheck] = useState(false);
    const [selected, setSelected] = useState(false);

    const fetchData = async()=>{
        try{
          const promotionSessYear = localStorage.getItem("PromotionSessionYear");
          const classId = localStorage.getItem("ClassesId");
          const className = localStorage.getItem("ClassesName");

          setPromotionsessionYear(promotionSessYear);
          setClassId(classId);
          setClassName(className);

          const {data:classesData, error:classesError} = await supabase
          .from("studentsignup")
          .select("*")
          .eq("class_id", classId)

          if(classesError) throw classesError;
          setClassarray(classesData);
        //   console.log("so so ", classesData)
        }catch(error){

        }finally{

        }
    }

    const toggleStudent = (id) => {
    setClassarray(prev => prev.map(students => students.id === id ? {...students, isChecked : !students.isChecked} : students))
    };

    const selectedCount = classArray.filter(s => s.isChecked).length;
    const pickAll = ()=> {
        setCheck(true);

        setClassarray(prev => prev.map(student => ({
        ...student,
        isChecked: true
    })));
    }

    const cancelAll = ()=> {
        setCheck(false)

         setClassarray(prev => prev.map(student => ({
        ...student,
        isChecked: false
    })));
    }

    const promote = async()=> {
        try{
         const studentsToPromote = classArray.filter(s => s.isChecked);
         const studentIds = studentsToPromote.map(s => s.id);
        //  const subjectIds = studentsToPromote.map(p=> p.subject_id)
        //  console.log("subject Id", subjectIds);
        //  console.log("chosen", studentIds)

        const results = await
        Swal.fire({
            icon:"question",
            title:"Promotion Method",
            text:"How do you want to select students for promotion?",
            showCancelButton:true,
            confirmButtonText: "Auto-Select (Based on Results)",
            cancelButtonText: "Manual Selection",
            reverseButtons: true
        })
        if(results.isConfirmed){
            const {data, error} = await supabase
            .from("student_results")
            .select("*, subjects!subject_id(*), studentsignup!student_id(*)")
            .in("student_id", studentIds)
            .eq("session", promotionSessionyear)
            .order('created_at', { ascending: false });

            if (error) throw error;
            setStudentresults(data);
            // console.log("All", data)
            // console.log(`results for ${studentIds}` , data)
        }else{
            // alert("no bby")
        }
        }catch(error){

        }finally{

        }
    }

    useEffect(()=>{
        fetchData();
    }, [])

       const calculateResult = studentResult.map((results)=> {
          
            const thirdTerm = studentResult.filter(item => 
                item.term === "Third Term"
            );

            let totalSum = [];
            thirdTerm.forEach(subject => {
                const test = subject.test_score;
                const exam = subject.exam_score;
                const subjectName = subject.subjects.subject_name

                const cummScore = Number(test) + Number(exam)
                // console.log("total score", cummScore);
                totalSum.push({
                    subjects:subjectName,
                    total:cummScore
                })
            })

            const firstterm = studentResult.filter(item => 
                item.term === "First Term"
             ) 
             const firstTermTestScores = firstterm.map(item => item.test_score);
             const firstTermExamScores = firstterm.map(item => item.exam_score);

             const firstTermScore = Number(firstTermTestScores) + Number(firstTermExamScores);
             console.log("Total", firstTermScore);

            //  const secondterm = studentResult.filter(item =>
            //     item.term === "Second Term"
            //  )

            //  const firstTermscore = Number(firstterm?.test_score) + Number(firstterm?.exam_score);

            //    console.log("first term score" , firstTermscore)
        

        // console.log(results)
       })


  return (
    <div>
        <div className='flex gap-2'>
            <h2 className='font-bold text-xl'>{promotionSessionyear}</h2>
            <h2 className='font-bold text-xl text-slate-400'>({Classname})</h2>
        </div>

        <div className='mt-3'>
            <div className={`flex justify-end ${check ? "" : "hidden"}`}>
                <button className='bg-red-500 w-20 p-1.5 rounded-xl text-white font-bold' onClick={cancelAll}>Cancel</button>
            </div>
            {classArray.map((cls)=> (
                <div className={`p-3 flex justify-between gap-2 shadow-sm mt-2 shadow-slate-400 rounded-xl ${cls.isChecked ? 'bg-blue-500/10 ': "bg-white"}`} key={cls.id} onClick={()=>check && toggleStudent(cls.id)}>
                    <div>
                        <p className='font-bold text-blue-600'>{cls.full_name}</p>
                        <small className='text-slate-400'>{cls.special_id}</small>
                    </div>

                    {check && (
                        <div className='h-fit my-auto'>
                        {cls.isChecked 
                        ?
                          <button className={` ${cls.isChecked ? "text-blue-500" : ""}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	                       <path d="M0 0h24v24H0z" fill="none" />
	                       <defs>
		                   <mask id="SVGCa0448Wh">
			               <g stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
				           <path fill="#fff" fill-opacity="0" stroke="#fff" stroke-dasharray="60" d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z">
					       <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0" />
					       <animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.4s" to="1" />
				           </path>
				           <path fill="none" stroke="#000" stroke-dasharray="14" stroke-dashoffset="14" d="M8 12l3 3l5 -5">
					       <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.1s" dur="0.2s" to="0" />
				           </path>
			               </g>
		                   </mask>
	                       </defs>
	                       <path fill="currentColor" d="M0 0h24v24H0z" mask="url(#SVGCa0448Wh)" />
                           </svg>
                        </button>
                        :""
                        }
                    </div>
                    )}
                </div>
            ))}

            <div className=''>
                {selectedCount > 0 ? (<button className='bg-blue-500 w-full p-2 mt-3 rounded-lg text-white font-bold' onClick={promote}>Promote ({selectedCount} Selected)</button>) : (<button className='bg-blue-500 w-full p-2 mt-3 rounded-lg text-white font-bold' onClick={pickAll}>Pick</button>)}
            </div>
        </div>
    </div>
  )
}
